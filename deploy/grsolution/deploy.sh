#!/usr/bin/env bash
set -Eeuo pipefail

DEPLOY_ROOT="${DEPLOY_ROOT:-/home/scallar/apps/grsolution-deploy}"
ENV_FILE="${ENV_FILE:-/home/scallar/apps/tv-wale/.env}"
DOCKER_IMAGE="${DOCKER_IMAGE:?DOCKER_IMAGE is required}"
VERIFY_URL="${VERIFY_URL:-https://grsolution.co.in}"
HEALTH_PATH="${HEALTH_PATH:-/api/health}"

NETWORK="grsolution-deploy"
ROUTER="grsolution-router"
LEGACY_CONTAINER="tv-wale"
ACTIVE_FILE="$DEPLOY_ROOT/active-color"
ROUTER_DIR="$DEPLOY_ROOT/router"
ROUTER_CONF="$ROUTER_DIR/default.conf"
ROUTER_TEMPLATE="$DEPLOY_ROOT/router.conf.tpl"

BLUE_CONTAINER="grsolution-blue"
GREEN_CONTAINER="grsolution-green"

mkdir -p "$ROUTER_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Environment file not found: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$ROUTER_TEMPLATE" ]]; then
  echo "Router template not found: $ROUTER_TEMPLATE" >&2
  exit 1
fi

docker network inspect "$NETWORK" >/dev/null 2>&1 || docker network create "$NETWORK" >/dev/null

active=""
if [[ -f "$ACTIVE_FILE" ]]; then
  active="$(tr -d '[:space:]' < "$ACTIVE_FILE")"
fi

case "$active" in
  blue)
    new="green"
    old_container="$BLUE_CONTAINER"
    new_container="$GREEN_CONTAINER"
    ;;
  green)
    new="blue"
    old_container="$GREEN_CONTAINER"
    new_container="$BLUE_CONTAINER"
    ;;
  *)
    active="none"
    new="blue"
    old_container=""
    new_container="$BLUE_CONTAINER"
    ;;
esac

echo "Active slot: $active; deploying $new with $DOCKER_IMAGE"

if [[ "${SKIP_PULL:-0}" != "1" ]]; then
  docker pull "$DOCKER_IMAGE"
fi

docker rm -f "$new_container" >/dev/null 2>&1 || true

docker run -d \
  --name "$new_container" \
  --network "$NETWORK" \
  --restart unless-stopped \
  --memory="700m" \
  --memory-swap="900m" \
  --cpus="1.0" \
  --env-file "$ENV_FILE" \
  -e NODE_ENV=production \
  --label "com.grsolution.slot=$new" \
  --label "com.grsolution.image=$DOCKER_IMAGE" \
  "$DOCKER_IMAGE" >/dev/null

cleanup_failed_slot() {
  docker logs "$new_container" --tail 100 || true
  docker rm -f "$new_container" >/dev/null 2>&1 || true
}

echo "Waiting for $new_container to become healthy..."
for attempt in $(seq 1 40); do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$new_container" 2>/dev/null || true)"
  if [[ "$status" == "healthy" ]]; then
    break
  fi
  if [[ "$status" == "running" ]] && docker exec "$new_container" node -e \
    "const r=require('http').get('http://127.0.0.1:3000${HEALTH_PATH}',x=>process.exit(x.statusCode>=200&&x.statusCode<400?0:1));r.on('error',()=>process.exit(1));r.setTimeout(4000,()=>{r.destroy();process.exit(1)})"; then
    break
  fi
  if [[ "$status" == "unhealthy" || "$status" == "exited" || "$attempt" -eq 40 ]]; then
    echo "$new_container failed its health check (status: $status)." >&2
    cleanup_failed_slot
    exit 1
  fi
  sleep 3
done

candidate_conf="$ROUTER_DIR/default.conf.candidate"
sed "s/__ACTIVE_CONTAINER__/$new_container/g" "$ROUTER_TEMPLATE" > "$candidate_conf"

rollback_router() {
  if [[ -f "$ROUTER_DIR/default.conf.previous" ]]; then
    mv -f "$ROUTER_DIR/default.conf.previous" "$ROUTER_CONF"
    docker exec "$ROUTER" nginx -t >/dev/null 2>&1 || true
    docker exec "$ROUTER" nginx -s reload >/dev/null 2>&1 || true
  fi
}

legacy_was_running=0
if docker ps --format '{{.Names}}' | grep -Fxq "$LEGACY_CONTAINER"; then
  legacy_was_running=1
fi

if docker ps --format '{{.Names}}' | grep -Fxq "$ROUTER"; then
  cp -f "$ROUTER_CONF" "$ROUTER_DIR/default.conf.previous"
  mv -f "$candidate_conf" "$ROUTER_CONF"
  if ! docker exec "$ROUTER" nginx -t; then
    rollback_router
    cleanup_failed_slot
    exit 1
  fi
  docker exec "$ROUTER" nginx -s reload
else
  mv -f "$candidate_conf" "$ROUTER_CONF"
  docker rm -f "$ROUTER" >/dev/null 2>&1 || true
  if [[ "$legacy_was_running" -eq 1 ]]; then
    echo "Stopping legacy GR Solution container to release port 3022..."
    docker stop "$LEGACY_CONTAINER" >/dev/null
  fi

  if ! docker run -d \
    --name "$ROUTER" \
    --network "$NETWORK" \
    --restart unless-stopped \
    -p "127.0.0.1:3022:80" \
    -v "$ROUTER_DIR:/etc/nginx/conf.d:ro" \
    nginx:1.27-alpine >/dev/null; then
    [[ "$legacy_was_running" -eq 1 ]] && docker start "$LEGACY_CONTAINER" >/dev/null || true
    cleanup_failed_slot
    exit 1
  fi
fi

verify_endpoint() {
  local url="$1"
  for attempt in $(seq 1 15); do
    if curl --fail --silent --show-error --location --max-time 15 "$url" >/dev/null; then
      return 0
    fi
    sleep 2
  done
  return 1
}

if ! verify_endpoint "http://127.0.0.1:3022${HEALTH_PATH}"; then
  echo "Local router verification failed; rolling back." >&2
  if [[ "$active" == "none" ]]; then
    docker rm -f "$ROUTER" >/dev/null 2>&1 || true
    [[ "$legacy_was_running" -eq 1 ]] && docker start "$LEGACY_CONTAINER" >/dev/null || true
  else
    rollback_router
  fi
  cleanup_failed_slot
  exit 1
fi

if ! verify_endpoint "${VERIFY_URL%/}${HEALTH_PATH}"; then
  echo "Public verification failed; rolling back." >&2
  if [[ "$active" == "none" ]]; then
    docker rm -f "$ROUTER" >/dev/null 2>&1 || true
    [[ "$legacy_was_running" -eq 1 ]] && docker start "$LEGACY_CONTAINER" >/dev/null || true
  else
    rollback_router
  fi
  cleanup_failed_slot
  exit 1
fi

printf '%s\n' "$new" > "$ACTIVE_FILE"
rm -f "$ROUTER_DIR/default.conf.previous"

echo "Deployment complete. Traffic is on $new_container."
if [[ -n "$old_container" ]] && docker ps -a --format '{{.Names}}' | grep -Fxq "$old_container"; then
  echo "Rollback slot retained: $old_container"
fi

docker ps --filter 'name=grsolution-' --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
