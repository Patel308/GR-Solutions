import cx from '@/components/ui/cx';

// Eyebrow, H2 and optional lead for a page section. The heading text is passed
// in unchanged; this only controls spacing and alignment.
export default function SectionHead({ eyebrow, title, lead, align = 'center', className, children }) {
  return (
    <div className={cx('section-head', align === 'center' && 'section-head-center', className)}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className={eyebrow ? 'mt-3' : undefined}>{title}</h2>
      {lead ? <p className="lead mt-3">{lead}</p> : null}
      {children}
    </div>
  );
}
