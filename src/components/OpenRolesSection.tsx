import Link from 'next/link';
import { Briefcase, Sparkles, Users, Zap } from 'lucide-react';

type Role = {
  title: string;
  about: string;
  whatYouWillDo: string[];
  whoYouAre: string[];
  perks: string[];
  bonus: string[];
};

const roles: Role[] = [
  {
    title: 'Brand Partnerships & Campus Collaborations Lead',
    about:
      'Build meaningful partnerships with student-focused brands, youth communities, fest organizers, startups, and campus ecosystems.',
    whatYouWillDo: [
      'Reach out to brands for collaborations and sponsorships',
      'Build partnerships with college festivals and communities',
      'Create activation ideas for brands inside campuses',
      'Help brands engage students meaningfully through Zynvo',
      'Coordinate campaign execution with internal teams',
      'Build long-term strategic relationships',
    ],
    whoYouAre: [
      'Strong networking and communication skills',
      'Comfortable with outreach and relationship building',
      'Creative about brand and campus collaborations',
      'Organized and execution-focused',
    ],
    perks: [
      'Direct exposure to startup growth and strategy',
      'Work with fast-growing youth brands',
      'Flexible and remote-friendly culture',
      'Freedom to experiment with ideas',
    ],
    bonus: [
      'Prior sponsorship or partnership experience',
      'Experience in student communities or media',
      'Strong LinkedIn or networking presence',
    ],
  },
  {
    title: 'Content & Community Storytelling Lead',
    about:
      'Shape how students see Zynvo online by turning campus moments into high-performing internet stories.',
    whatYouWillDo: [
      'Create content ideas for Instagram, LinkedIn, Reddit, and X',
      'Turn college stories into engaging formats',
      'Work on launch campaigns for new features',
      'Build meme-driven, community-first marketing',
      'Collaborate with student creators and ambassadors',
      'Help define Zynvo’s internet personality and voice',
    ],
    whoYouAre: [
      'Extremely online and trend-aware',
      'Strong understanding of meme and youth internet culture',
      'Can execute quickly with strong hooks and storytelling',
      'Passionate about startups, students, and communities',
    ],
    perks: [
      'High creative freedom',
      'Opportunity to shape a youth-facing brand early',
      'Flexible work environment',
      'Work closely with founders on campaigns and launches',
    ],
    bonus: [
      'Prior creator experience',
      'Experience managing meme pages or student communities',
      'Portfolio of content or campaigns',
    ],
  },
  {
    title: 'Campus Growth Lead',
    about:
      'Make Zynvo impossible to ignore on campuses by driving adoption through clubs, leaders, events, and student communities.',
    whatYouWillDo: [
      'Onboard clubs and student communities',
      'Build relationships with student leaders and fest organizers',
      'Launch campus activation campaigns',
      'Grow ambassador and volunteer networks',
      'Help clubs run events successfully on Zynvo',
      'Collect student feedback and convert it into insights',
      'Increase recurring student participation on the platform',
    ],
    whoYouAre: [
      'Deeply involved in college communities or youth ecosystems',
      'Strong communicator with high social energy',
      'Comfortable speaking to club heads and organizers',
      'Execution-oriented and highly proactive',
    ],
    perks: [
      'Work directly with the founding team',
      'Real ownership from day 1',
      'Opportunity to shape student culture across campuses',
      'Fast growth opportunities as the company scales',
    ],
    bonus: [
      'Experience running college fests, clubs, or communities',
      'Creator/community-building background',
      'Startup or campus ambassador experience',
    ],
  },
];

export default function OpenRolesSection() {
  return (
    <section id="open-roles" className="bg-yellow-300 px-4 py-16 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-200 px-4 py-1.5 shadow-[4px_4px_0_rgba(0,0,0,0.95)]">
            <Briefcase className="h-4 w-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wide">Open Roles</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Build Zynvo with us</h2>
          <p className="mt-3 text-base font-medium text-black/80 sm:text-lg">
            We are hiring across growth, partnerships, and storytelling. Pick the lane that matches your
            energy.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.title}
              className="rounded-3xl border-2 border-black bg-yellow-200 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.95)] transition-transform duration-200 hover:-translate-y-1"
            >
              <h3 className="text-xl font-extrabold leading-snug">{role.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">{role.about}</p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold">
                    <Zap className="h-4 w-4" />
                    What you will do
                  </p>
                  <ul className="space-y-1 text-sm">
                    {role.whatYouWillDo.map((item) => (
                      <li key={item} className="font-medium text-black/85">
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold">
                    <Users className="h-4 w-4" />
                    Who you are
                  </p>
                  <ul className="space-y-1 text-sm">
                    {role.whoYouAre.map((item) => (
                      <li key={item} className="font-medium text-black/85">
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold">
                    <Sparkles className="h-4 w-4" />
                    Perks
                  </p>
                  <ul className="space-y-1 text-sm">
                    {role.perks.map((item) => (
                      <li key={item} className="font-medium text-black/85">
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-extrabold">
                    <Sparkles className="h-4 w-4" />
                    Bonus points
                  </p>
                  <ul className="space-y-1 text-sm">
                    {role.bonus.map((item) => (
                      <li key={item} className="font-medium text-black/85">
                        - {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <a
            href="https://www.instagram.com/zynvo.social/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-black bg-black px-6 py-3 text-sm font-bold uppercase tracking-wide text-yellow-300 transition-colors hover:bg-yellow-100 hover:text-black"
          >
            Apply via Instagram
          </a>
          <p className="text-sm font-semibold text-black/75">
            DM us your profile and role preference. We will get back to you.
          </p>
        </div>
      </div>
    </section>
  );
}
