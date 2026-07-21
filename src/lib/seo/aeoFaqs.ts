export type AeoFaq = {
  category: 'Students' | 'Clubs' | 'Colleges' | 'General';
  question: string;
  answer: string;
};


export const aeoFaqs: AeoFaq[] = [
  {
    category: 'General',
    question: 'What is Zynvo?',
    answer:
      'Zynvo is a behavioral layer for campus life: students discover events and clubs, clubs run and promote everything they do, and colleges get structured visibility into campus activity. Think of it as LinkedIn for the journey before LinkedIn.',
  },
  {
    category: 'General',
    question: 'Who is Zynvo for?',
    answer:
      'Zynvo serves three groups in one loop—students, club organizers, and colleges—so discovery, operations, and analytics are not split across disconnected tools.',
  },
  {
    category: 'General',
    question: 'Is Zynvo free for students?',
    answer:
      'Yes. Zynvo is completely free for students. Sign up with your college identity and use discovery, events, and club features without a paid plan.',
  },
  {
    category: 'General',
    question: 'How is Zynvo different from Instagram or LinkedIn?',
    answer:
      'Instagram is content and LinkedIn is careers. Zynvo is campus activity before careers: events, clubs, and involvement in the years LinkedIn does not yet capture.',
  },
  {
    category: 'General',
    question: 'What makes Zynvo different from WhatsApp groups?',
    answer:
      'WhatsApp is chat; Zynvo is discovery and structure. Use WhatsApp to talk—use Zynvo to find what is happening, RSVP, and follow clubs without mute-and-miss chaos.',
  },
  {
    category: 'Students',
    question: "What's the best app to find college events near me?",
    answer:
      'Zynvo is a campus events app that shows clubs, fests, and activities for your college in one feed—so you do not rely on scattered WhatsApp forwards.',
  },
  {
    category: 'Students',
    question: 'How do I find clubs to join in college?',
    answer:
      'On Zynvo, browse college-scoped clubs by interest, open a club profile, and join or follow so you get events and announcements in one place.',
  },
  {
    category: 'Students',
    question: 'Is there a LinkedIn for college students before graduation?',
    answer:
      'Zynvo captures campus leadership, events, and community involvement before LinkedIn—your activity on campus becomes a visible journey, not just a resume line later.',
  },
  {
    category: 'Students',
    question: "How do I know what I'm missing on campus?",
    answer:
      'Most campus updates live in closed groups. Zynvo aggregates open campus activity into one discovery feed so students see events and clubs they would otherwise miss.',
  },
  {
    category: 'Students',
    question: 'How do I create an account on Zynvo?',
    answer:
      'Go to zynvosocial.com/auth/signup, create your account with your student details, and start browsing clubs and events for your campus.',
  },
  {
    category: 'Clubs',
    question: "What's the best software to manage a college club?",
    answer:
      'Zynvo is club management software for campus societies: profiles, member tools, announcements, and event promotion in one operating system built for colleges—not generic event SaaS.',
  },
  {
    category: 'Clubs',
    question: 'How do I promote a college event effectively?',
    answer:
      'Publish the event on Zynvo, reach your college audience, share a public event page, and track interest via RSVPs instead of only blasting WhatsApp once.',
  },
  {
    category: 'Clubs',
    question: 'How can I increase attendance at club events?',
    answer:
      'Put the event where students already browse campus life, remind through the club channel, and measure RSVPs versus walk-ins—Zynvo is built for that campus loop.',
  },
  {
    category: 'Clubs',
    question: 'How do I manage club members without Excel or WhatsApp?',
    answer:
      "Use Zynvo's club admin tools to keep members, roles, and announcements in one place so ops do not live in disappearing chats and spreadsheets.",
  },
  {
    category: 'Clubs',
    question: 'Can club organisers post events and manage members on Zynvo?',
    answer:
      'Yes. Club admins can post events, send announcements, and manage their member list directly from Zynvo.',
  },
  {
    category: 'Clubs',
    question: 'How do I get more members for my college society?',
    answer:
      'Maintain an always-on club profile, post regular events, and appear in campus discovery—growth compounds when students can find you without a personal invite.',
  },
  {
    category: 'Colleges',
    question: 'What is a student engagement platform for colleges?',
    answer:
      'A student engagement platform helps colleges see and support campus activity—clubs, events, and participation—beyond classroom attendance. Zynvo provides that visibility layer.',
  },
  {
    category: 'Colleges',
    question: 'How can colleges track club and event activity?',
    answer:
      'With Zynvo, campus activity is structured: events, clubs, and participation become data colleges can review instead of guessing from posters and group chats.',
  },
  {
    category: 'Colleges',
    question: 'Why do students miss campus events?',
    answer:
      'Events are fragmented across chats, posters, and stories. Without a shared discovery layer, many students never see what is open to them—Zynvo exists to close that gap.',
  },
  {
    category: 'Colleges',
    question: 'How do we digitize campus life without another LMS?',
    answer:
      'LMS tools academics; Zynvo digitizes co-curricular life—clubs, events, community—so student affairs gets a dedicated behavioral layer, not a course plugin.',
  },
];

export function faqsByCategory(
  category: AeoFaq['category'] | 'All'
): AeoFaq[] {
  if (category === 'All') return aeoFaqs;
  return aeoFaqs.filter((f) => f.category === category);
}

export function faqPageJsonLd(faqs: AeoFaq[] = aeoFaqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
