const stepIcons = [
  'fa-solid fa-calendar-check',
  'fa-solid fa-magnifying-glass',
  'fa-solid fa-file-invoice',
  'fa-solid fa-wrench',
  'fa-solid fa-circle-check',
];

// Numbered process shown as a timeline (vertical on phones, a row from 992px).
// `titleAs` keeps each template's original markup: service pages use an <h3>
// per step, city and brand pages a plain paragraph.
export default function ProcessSteps({ steps, titleAs: Title = 'h3' }) {
  if (!steps?.length) return null;

  return (
    <ol className="timeline" style={{ '--steps': steps.length }}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="icon-tile relative bg-white text-navy-600 shadow-xs ring-1 ring-navy-100" aria-hidden="true">
            <i className={step.icon || stepIcons[index] || 'fa-solid fa-check'} />
          </span>
          <div className="min-w-0 pt-0.5 lg:pt-0">
            <span className="text-eyebrow font-semibold uppercase text-teal-700">STEP {index + 1}</span>
            <Title
              className={
                Title === 'h3'
                  ? 'mt-1 text-[1.0625rem] sm:text-lg'
                  : 'mt-1 font-semibold leading-relaxed text-ink'
              }
            >
              {step.title}
            </Title>
            {step.text ? <p className="mt-1.5 text-small leading-relaxed text-muted">{step.text}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
