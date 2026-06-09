import type {
  AatContent,
  HomeContent,
  LegalPage,
  RichText,
  SiteSettings,
} from "./types";

/* ------------------------------------------------------------------ */
/* Portable Text helpers                                               */
/* ------------------------------------------------------------------ */

let keyCounter = 0;
function k(prefix = "k"): string {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

interface Span {
  text: string;
  marks?: string[];
}

/** Build a single Portable Text block (normal paragraph by default). */
function block(
  spans: Span[],
  opts?: { listItem?: "bullet"; level?: number },
): RichText[number] {
  return {
    _type: "block",
    _key: k("b"),
    style: "normal",
    markDefs: [],
    ...(opts?.listItem ? { listItem: opts.listItem } : {}),
    ...(opts?.level ? { level: opts.level } : {}),
    children: spans.map((s) => ({
      _type: "span",
      _key: k("s"),
      text: s.text,
      marks: s.marks ?? [],
    })),
  };
}

/** A single-paragraph RichText from a list of spans. */
function para(...spans: Span[]): RichText {
  return [block(spans)];
}

/* ------------------------------------------------------------------ */
/* Site-wide settings                                                  */
/* ------------------------------------------------------------------ */
export const siteSettings: SiteSettings = {
  brandName: "Rewilding",
  brandSubtitle: "Speech Therapy",
  tagline:
    "Where communication grows naturally—sparked by joy, rooted in connection",
  primaryCta: { label: "Get Started", href: "/contact" },
  contactEmail: undefined,
  contactPhone: undefined,
  address: {
    locality: "Lawrence",
    region: "KS",
    country: "US",
  },
  serviceAreas: ["Lawrence", "Topeka", "Olathe", "Overland Park"],
  copyrightName: "Rewilding Speech Therapy",
  defaultSeo: {
    title:
      "Rewilding Speech Therapy - Lawrence, Kansas | AAC & Gestalt Language Processing",
    description:
      "Private speech therapy in Lawrence, Kansas specializing in AAC and Gestalt Language Processing. Neurodiversity-affirming, nature-based communication support for children and families in Lawrence, Topeka, and surrounding areas.",
    keywords: [
      "speech therapy Lawrence KS",
      "speech pathologist Lawrence Kansas",
      "AAC therapy Lawrence",
      "gestalt language processing Kansas",
      "pediatric speech therapy Lawrence",
      "neurodiversity affirming therapy",
      "nature based therapy Lawrence",
      "speech language pathologist Douglas County",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */
export const homeContent: HomeContent = {
  hero: {
    headingLine1: "Welcome to",
    headingLine2: "Rewilding",
    subLabel: "Speech Therapy",
    lead: "Where communication grows naturally—sparked by joy, rooted in connection.",
    serviceArea:
      "Serving families in Lawrence, Topeka, and the surrounding Kansas communities.",
    cta: { label: "Get in touch", href: "/contact" },
    portrait: {
      src: "/images/kailey.jpg",
      alt: "Kailey Petrehn, Speech-Language Pathologist",
    },
  },
  approach: {
    heading: "Our Approach",
    intro:
      "Everyone deserves a voice—through words, signs, gestures, pictures, or devices.",
    cards: [
      {
        badge: "Natural",
        accent: "primary",
        title: "Support, in real life.",
        description:
          "Communication thrives in authentic spaces that are personally meaningful.",
        bullets: [
          "Adult groups for connection, practice, and support",
          "Parent coaching with everyday strategies applied to your real life",
          "Community-based sessions in natural environments",
        ],
        image: {
          src: "/images/support-photo.jpg",
          alt: "Support in real life",
        },
      },
      {
        badge: "Communication",
        accent: "secondary",
        title: "AAC",
        description:
          "Augmentative & Alternative Communication provides another way to communicate—through gestures, pictures, or devices.",
        bullets: [
          "Integrated into real-life experiences",
          "Modeled with joy and curiosity, not drills",
          "A tool that grows alongside speech, never replacing it",
        ],
        image: {
          src: "/images/aac-photo.jpg",
          alt: "AAC in practice",
        },
      },
      {
        badge: "Learning",
        accent: "primary",
        title: "Gestalt Language Processing",
        description:
          "Some people learn language in scripts or chunks—a natural, valid way of learning.",
        bullets: [
          "Celebrating scripts as meaningful communication",
          "Guiding growth from scripts to flexible, spontaneous language",
          "Rooted in play, joy, and connection instead of correction",
        ],
        image: {
          src: "/images/glp-photo.jpeg",
          alt: "Gestalt Language Processing in practice",
        },
      },
      {
        badge: "Connection",
        accent: "secondary",
        title: "Animal-Assisted Therapy 🐾",
        description:
          "Animals invite connection naturally—sparking curiosity, bringing calm, and creating shared joy.",
        bullets: [
          "Creates low-pressure communication opportunities",
          "Meet Larry, Otis & Joey",
        ],
        href: "/aat",
        linkLabel: "Learn more",
      },
    ],
  },
  philosophy: {
    heading: "What Makes Us Different",
    intro:
      "A neurodiversity-affirming approach that honors each person's unique communication style on their timeline.",
    feature: {
      badge: "Core Philosophy",
      title: "Neurodiversity-Affirming",
      paragraphs: [
        "We honor each person's unique communication style. Our role is to support and celebrate who they are—not to change them.",
        "Every form of expression is valid and meaningful. We create spaces where authentic communication can flourish naturally, on each child's own timeline.",
      ],
      quote: "Communication grows best when rooted in acceptance and joy",
    },
    smallCards: [
      {
        title: "Specialized in AAC",
        body: "AAC is a bridge to connection that grows alongside speech.",
      },
      {
        title: "Parent Partnership",
        body: "You know your child best. We equip you with practical strategies that work in real moments—downtown, at the grocery store, or exploring nature together.",
      },
      {
        title: "Communication Coaching",
        body: "Sessions meet you where life happens—downtown, at the grocery store, or exploring nature—building skills in the moments that matter most.",
      },
    ],
    goalTitle: "Our Goal for Every Family",
    goalBody:
      "We want your child to feel confident, connected, and understood—building independence, joy, and connection to your family.",
  },
  team: {
    heading: "Meet Kailey",
    portrait: {
      src: "/images/kailey.jpg",
      alt: "Kailey Petrehn, Speech-Language Pathologist",
    },
    quote:
      "Rewilding is restoring what is natural. For us, it means nurturing communication so it can grow wild, true, and free.",
    name: "Kailey Petrehn",
    title: "Speech-Language Pathologist",
    credentialLine: "M.A., CCC-SLP • Founder & Owner",
    bio: [
      "Kailey is a Speech-Language Pathologist dedicated to creating joyful, nature-inspired spaces where communication can flourish.",
      "With specialized training in AAC and Gestalt Language Processing, she brings a neurodiversity-affirming approach to every session—creating supportive environments where children and families can discover and celebrate their natural communication styles.",
    ],
    expertise: [
      "AAC (Augmentative & Alternative Communication)",
      "Gestalt Language Processing",
      "Working with children and adults with developmental disabilities",
      "Parent Coaching",
    ],
    specialInterests: ["Nature-Based Therapy", "Animal-Assisted Therapy"],
    credentials: [
      "Masters in Speech-Language Pathology",
      "Certificate of Clinical Competence (CCC-SLP)",
      "Licensed Speech-Language Pathologist",
    ],
  },
  faq: {
    heading: "Payment & Insurance",
    items: [
      {
        question: "Do you take insurance?",
        answer: para({
          text: "Rewilding Speech is a cash-pay practice, which means payment is due at the time of service.",
        }),
      },
      {
        question: "Can I use my insurance benefits?",
        answer: para({
          text: "Yes! While we don't bill insurance directly, we can provide a superbill (an itemized receipt) that you can submit to your insurance company. Depending on your plan, you may receive partial reimbursement for out-of-network services.",
        }),
      },
      {
        question: "How do I know if my plan will cover it?",
        answer: [
          block([
            {
              text: "Since coverage varies, we recommend calling your insurance provider and asking about your out-of-network speech therapy benefits. Here are some helpful questions to ask:",
            },
          ]),
          block(
            [
              {
                text: "Do I have out-of-network benefits for speech therapy?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block(
            [
              {
                text: "What is my deductible, and how much of it has been met?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block(
            [
              {
                text: "What percentage of the session fee will be reimbursed once my deductible is met?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block(
            [
              {
                text: "Is there a limit on the number of speech therapy sessions covered per year?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block(
            [
              {
                text: "Do I need a referral or pre-authorization for speech therapy?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block(
            [
              {
                text: "How do I submit a superbill for reimbursement?",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
        ],
      },
    ],
  },
  seo: siteSettings.defaultSeo,
};

/* ------------------------------------------------------------------ */
/* Animal-Assisted Therapy page                                        */
/* ------------------------------------------------------------------ */
export const aatContent: AatContent = {
  hero: {
    emoji: "🐾",
    heading: "Animal-Assisted Therapy",
    lead: "Animals have a natural way of inviting connection. Their presence can spark curiosity, bring calm, and create moments of shared joy—often without words.",
  },
  intro: [
    block([
      { text: "At " },
      { text: "Rewilding Speech", marks: ["em"] },
      {
        text: ", animal-assisted therapy is one of many ways we support communication that feels natural, meaningful, and alive. It's never about \"performing\" or following a script—it's about creating space for authentic interaction where communication can emerge organically through relationship and shared experience.",
      },
    ]),
  ],
  photo: {
    src: "/images/aat-photo.jpg",
    alt: "Child interacting with therapy goats",
  },
  whyAnimals: {
    heading: "Why Animals?",
    intro: "Animals can help communication grow because they:",
    points: [
      para(
        { text: "Invite " },
        { text: "joy and curiosity", marks: ["strong"] },
        { text: ", which naturally spark communication" },
      ),
      para(
        { text: "Offer " },
        { text: "comfort and regulation", marks: ["strong"] },
        { text: ", supporting nervous system safety" },
      ),
      para(
        { text: "Create " },
        { text: "low-pressure opportunities", marks: ["strong"] },
        { text: " for interaction and expression" },
      ),
      para(
        { text: "Encourage " },
        { text: "connection", marks: ["strong"] },
        { text: " through shared attention, movement, and care" },
      ),
    ],
    closing:
      "For many people, animals feel easier to connect with than adults or peers—and that connection becomes a bridge to communication.",
  },
  meetAnimals: {
    heading: "Meet Our Therapy Animals",
    body: [
      block([
        { text: "I currently partner with two Nigerian Dwarf goats, " },
        { text: "Larry and Otis", marks: ["strong"] },
        { text: ". My miniature donkey, " },
        { text: "Joey", marks: ["strong"] },
        { text: ", is learning the ropes and in training!" },
      ]),
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What is animal-assisted therapy?",
        answer: para({
          text: "Animal-assisted therapy thoughtfully includes animals in sessions to support connection, regulation, and communication. Animals may be present as a calming companion, a shared focus of attention, or a source of joy and curiosity.",
        }),
      },
      {
        question: "Is animal-assisted therapy right for everyone?",
        answer: para({
          text: "Not necessarily—and that's okay. Participation is always optional. Some people enjoy interacting with animals, while others prefer to observe from a distance or choose a different therapeutic approach altogether. Therapy is always shaped around individual comfort, preferences, and consent.",
        }),
      },
      {
        question: "How does animal-assisted therapy support communication?",
        answer: [
          block([{ text: "Animals naturally create opportunities for:" }]),
          block([{ text: "Shared attention and connection" }], {
            listItem: "bullet",
            level: 1,
          }),
          block([{ text: "Requests, comments, and observations" }], {
            listItem: "bullet",
            level: 1,
          }),
          block([{ text: "AAC use, gestures, scripts, or spoken language" }], {
            listItem: "bullet",
            level: 1,
          }),
          block(
            [
              {
                text: "Regulation and emotional safety, which support communication readiness",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
          block([
            {
              text: "Communication emerges through real, meaningful experiences—not prompts or drills.",
              marks: ["em"],
            },
          ]),
        ],
      },
      {
        question: "How do you ensure safety and well-being?",
        answer: [
          block([
            { text: "Safety, consent, and welfare are central—for both people " },
            { text: "and", marks: ["em"] },
            { text: " animals." },
          ]),
          block([{ text: "All interactions are closely supervised" }], {
            listItem: "bullet",
            level: 1,
          }),
          block([{ text: "Boundaries are respected at all times" }], {
            listItem: "bullet",
            level: 1,
          }),
          block([{ text: "Animals are never forced to participate" }], {
            listItem: "bullet",
            level: 1,
          }),
          block(
            [
              {
                text: "Sessions are adapted based on comfort, energy, and stress levels",
              },
            ],
            { listItem: "bullet", level: 1 },
          ),
        ],
      },
      {
        question: "What training do you have in animal-assisted therapy?",
        answer: [
          block([
            { text: "I hold the " },
            { text: "C-AAIS certification", marks: ["strong"] },
            {
              text: " (Certified Animal-Assisted Intervention Specialist) through the Association of Animal-Assisted Intervention Professionals (AAAIP). This certification reflects specialized training in ethical, safe, and evidence-informed animal-assisted interventions, with a strong emphasis on animal welfare, infection prevention, animal behavior awareness, and professional best practices.",
            },
          ]),
        ],
      },
      {
        question:
          "Does animal-assisted therapy replace traditional speech therapy?",
        answer: para({
          text: "No. Animal-assisted therapy is one of many ways communication can be supported at Rewilding Speech. It is always integrated thoughtfully into a broader, individualized approach that may include AAC, play, nature-based experiences, parent coaching, and community-based support.",
        }),
      },
      {
        question: "What if my child (or I) feel nervous around animals?",
        answer: para({
          text: "That is completely respected. Therapy can continue without animals, or animals may simply be present in the environment without interaction. Comfort, choice, and trust always come first.",
        }),
      },
    ],
  },
  cta: {
    label: "Get in Touch",
    href: "/contact",
    note: "Questions about animal-assisted therapy? We'd love to hear from you.",
  },
  seo: {
    title: "Animal-Assisted Therapy | Rewilding Speech Therapy",
    description:
      "Animal-assisted speech therapy in Lawrence, Kansas. Meet our therapy goats Larry and Otis and learn how animals support communication, connection, and regulation.",
  },
};

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* ------------------------------------------------------------------ */

/** Section heading block (rendered bold/strong as a lightweight heading). */
function legalHeading(text: string): RichText[number] {
  return block([{ text, marks: ["strong"] }]);
}

export const privacyContent: LegalPage = {
  title: "Privacy Policy",
  body: [
    block([
      {
        text: "Rewilding Speech Therapy (\"we,\" \"us,\" or \"our\") respects your privacy. This Privacy Policy explains what information we collect through this marketing website, how we use it, and the choices you have.",
      },
    ]),
    legalHeading("Information We Collect"),
    block([
      {
        text: "When you submit our contact form, we collect the information you choose to provide: your name, email address, an optional phone number, and the message you write. We do not ask for and do not knowingly collect any protected health information (PHI) through this website.",
      },
    ]),
    legalHeading("This Site Is Not a Patient Portal"),
    block([
      {
        text: "This website is an informational and marketing site only. It is not a patient portal and is not intended for the transmission of medical records, treatment details, or other protected health information. Please do not include sensitive health information in the contact form.",
      },
    ]),
    legalHeading("How We Use Your Information"),
    block([
      {
        text: "We use the information you submit solely to respond to your inquiry, to schedule or discuss services, and to communicate with you about Rewilding Speech Therapy. We do not sell your personal information.",
      },
    ]),
    legalHeading("Email Delivery and Service Providers"),
    block([
      {
        text: "We use Resend, a third-party email delivery provider, to process and deliver messages submitted through our contact form. Resend processes this information on our behalf and is required to safeguard it. Your information is shared with this provider only to the extent necessary to deliver your message to us.",
      },
    ]),
    legalHeading("Cookies and Analytics"),
    block([
      {
        text: "This website may use minimal cookies or privacy-conscious analytics to understand general usage and improve the site. These tools do not identify you personally. You can control cookies through your browser settings.",
      },
    ]),
    legalHeading("Data Retention"),
    block([
      {
        text: "We retain contact-form submissions only as long as needed to respond to your inquiry and maintain reasonable business records, after which they are deleted.",
      },
    ]),
    legalHeading("Your Choices and Requests"),
    block([
      {
        text: "You may request access to, correction of, or deletion of the information you have submitted through this site at any time. To make a request, please contact us using the information below.",
      },
    ]),
    legalHeading("Contact Us"),
    block([
      {
        text: "If you have questions about this Privacy Policy or your information, please reach out through the contact form on this website. We are based in Lawrence, Kansas.",
      },
    ]),
  ],
  seo: {
    title: "Privacy Policy | Rewilding Speech Therapy",
    description:
      "How Rewilding Speech Therapy collects and handles information submitted through this website.",
  },
};

export const termsContent: LegalPage = {
  title: "Terms of Service",
  body: [
    block([
      {
        text: "These Terms of Service (\"Terms\") govern your use of the Rewilding Speech Therapy website. By accessing or using this site, you agree to these Terms.",
      },
    ]),
    legalHeading("Informational Use Only"),
    block([
      {
        text: "This website is provided for general informational purposes about Rewilding Speech Therapy and its services. The content is not a substitute for professional evaluation, diagnosis, or treatment.",
      },
    ]),
    legalHeading("No Doctor–Patient Relationship"),
    block([
      {
        text: "Using this website, including submitting the contact form, does not create a clinician–client or doctor–patient relationship. A professional relationship is established only after a formal agreement to provide services.",
      },
    ]),
    legalHeading("No Medical Advice"),
    block([
      {
        text: "Nothing on this website constitutes medical, clinical, or therapeutic advice. Always seek the guidance of a qualified professional regarding any health or communication concern.",
      },
    ]),
    legalHeading("Intellectual Property"),
    block([
      {
        text: "All content on this website, including text, images, logos, and design, is the property of Rewilding Speech Therapy or its licensors and is protected by applicable intellectual property laws. You may not reproduce or distribute it without permission.",
      },
    ]),
    legalHeading("Third-Party Links"),
    block([
      {
        text: "This website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of any third-party site.",
      },
    ]),
    legalHeading("Limitation of Liability"),
    block([
      {
        text: "To the fullest extent permitted by law, Rewilding Speech Therapy is not liable for any damages arising from your use of, or inability to use, this website or any content on it.",
      },
    ]),
    legalHeading("Governing Law"),
    block([
      {
        text: "These Terms are governed by the laws of the State of Kansas, without regard to its conflict-of-law principles.",
      },
    ]),
    legalHeading("Changes to These Terms"),
    block([
      {
        text: "We may update these Terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.",
      },
    ]),
    legalHeading("Contact Us"),
    block([
      {
        text: "If you have questions about these Terms, please reach out through the contact form on this website. We are based in Lawrence, Kansas.",
      },
    ]),
  ],
  seo: {
    title: "Terms of Service | Rewilding Speech Therapy",
    description:
      "The terms governing use of the Rewilding Speech Therapy website.",
  },
};
