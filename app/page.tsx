import Link from 'next/link';

const features = [
  ['01', 'Job Description Breakdown', 'Separate must-have skills, preferred skills, responsibilities, tools, experience expectations, and keywords.'],
  ['02', 'Resume Evidence Audit', 'Check whether your resume actually proves the requirements instead of just listing buzzwords.'],
  ['03', 'Evidence Matrix', 'Map Job Requirement → Resume Evidence → Strength → Gap → Action.'],
  ['04', 'Project Relevance Test', 'See whether your projects support the role you are targeting.'],
  ['05', 'Bullet Point Fixer', 'Turn vague project and experience statements into evidence-led bullets.'],
  ['06', 'Skills + Keyword Audit', 'Keep relevant, supported skills and capture important JD language.'],
  ['07', 'Application Audit', 'Run a final check before clicking Apply.'],
  ['08', 'Application Tracker', 'Track applications, follow-ups, interviews, and outcomes.'],
];

const problems = [
  'Same resume everywhere',
  'Skills without evidence',
  'Irrelevant projects',
  'Weak resume bullets',
  'Missing JD keywords',
  'Applying without a final audit',
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">BUILT FOR ENGINEERING STUDENTS • ONE-TIME ₹499</div>

          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                Stop sending the <span className="gradient-text">same resume</span> to every job.
              </h1>

              <p className="hero-copy">
                Find what is missing from your application before you hit Apply. Audit the job description,
                resume evidence, projects, skills, bullets, and final application in one practical kit.
              </p>

              <div className="hero-actions">
                <Link href="/pay" className="btn btn-primary">
                  Get the Application Fix Kit — ₹499
                </Link>
                <a href="#inside" className="btn btn-secondary">
                  See what’s inside
                </a>
              </div>
            </div>

            <div className="hero-panel card">
              <div className="mini-label">Your application checklist</div>
              <div className="mini-stack">
                <div className="mini-item">
                  <span>JD</span>
                  <strong>Match requirements</strong>
                </div>
                <div className="mini-item">
                  <span>Resume</span>
                  <strong>Show proof</strong>
                </div>
                <div className="mini-item">
                  <span>Projects</span>
                  <strong>Support the role</strong>
                </div>
                <div className="mini-item">
                  <span>Final</span>
                  <strong>Audit before applying</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-grid">
            <Stat n="01" t="Understand" d="What the JD actually asks for" />
            <Stat n="02" t="Map" d="Requirements to real evidence" />
            <Stat n="03" t="Fix" d="Gaps before you apply" />
          </div>
        </div>
      </section>

      <section className="section" id="inside">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">What’s inside</p>
            <h2>Everything you need to turn a generic application into a targeted one.</h2>
          </div>

          <div className="feature-grid">
            {features.map(([id, title, description]) => (
              <article className="feature-card card" key={id}>
                <span className="feature-index">{id}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section" id="how">
        <div className="container">
          <div className="section-heading narrow">
            <p className="eyebrow">The problem</p>
            <h2>Having the skill isn’t enough if your application doesn’t show it.</h2>
          </div>

          <div className="problem-grid">
            {problems.map((problem, index) => (
              <div className="problem-card card" key={problem}>
                <span className="problem-number">0{index + 1}</span>
                <h3>{problem}</h3>
                <p>
                  A practical audit helps you spot the missing proof before your application gets rejected for
                  the wrong reason.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box card">
            <div>
              <p className="eyebrow">Ready to improve your applications?</p>
              <h2>Make stronger applications with less guesswork.</h2>
            </div>
            <Link href="/pay" className="btn btn-primary">
              Get the kit — ₹499
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="stat-card card">
      <div className="stat-number">{n}</div>
      <div className="stat-title">{t}</div>
      <div className="stat-desc">{d}</div>
    </div>
  );
}
