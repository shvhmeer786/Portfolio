export const profile = {
  name: 'Shahmeer Ali',
  email: 'shvhmeer@gmail.com',
  focus: 'Research & applied AI',
  location: 'Seattle & Toronto',
  introduction: 'Applied scientist and researcher, working in applied AI.',
  biography: 'My experience spans applied science at Microsoft and co-founding Orena. I study Systems Design Engineering at the University of Waterloo.',
  personal: 'There’s a person behind the research. Here are a few places and moments from life beyond the screen.',
};

export type PortfolioEntry = {
  slug: string;
  organization: string;
  title: string;
  category: string;
  summary: string;
  date: string | null;
  paragraphs: string[];
  links: { label: string; href: string }[];
  sample: boolean;
};

export type ExperienceEntry = {
  slug: string;
  organization: string;
  title: string;
  summary: string;
  team?: string;
  date: string;
  ongoing?: boolean;
  location: string;
  href: string;
  logo: string;
};

export const experiences: ExperienceEntry[] = [
  {
    slug: 'orena', organization: 'Orena', title: 'CTO & Co-founder',
    summary: 'The engine for human connection—an agent platform for event planning.',
    date: 'Jan 2026–Present', ongoing: true, location: 'Seattle, Washington',
    href: 'https://www.orena.dev/', logo: '/logos/orena.svg',
  },
  {
    slug: 'microsoft', organization: 'Microsoft', title: 'Applied Scientist',
    summary: 'Security research on foundation models, adversarial attacks, LLM evaluation, and agents.',
    date: 'May–Sep 2026', location: 'Redmond, Washington',
    href: 'https://www.microsoft.com/en-us/research/', logo: '/logos/microsoft.png',
  },
  {
    slug: 'remmie', organization: 'Remmie Health', title: 'ML Researcher · Innovation Lead',
    summary: 'Deep learning and computer vision research, with a focus on model optimization.',
    date: 'Sep–Dec 2025', location: 'Seattle, Washington',
    href: 'https://remmiehealth.com/', logo: '/logos/remmie.png',
  },
  {
    slug: 'bmc-helix', organization: 'BMC Helix', title: 'AI Engineer',
    team: 'R&D Data Science', summary: 'Building agentic semantic models.',
    date: 'Jan–May 2025', location: 'Santa Clara, California',
    href: 'https://www.helixops.ai/', logo: '/logos/bmc.png',
  },
  {
    slug: 'bmc', organization: 'BMC', title: 'Machine Learning Engineer',
    team: 'R&D Data Science', summary: 'Developing NLP, advanced machine learning, and retrieval-augmented generation.',
    date: 'May–Sep 2024', location: 'Santa Clara, California',
    href: 'https://www.helixops.ai/', logo: '/logos/bmc.png',
  },
  {
    slug: 'rbc-data-scientist', organization: 'RBC', title: 'Data Scientist',
    team: 'IFRS9 & Credit Analysis · GRM',
    summary: 'Outlier detection and machine learning models for credit analysis.',
    date: 'Sep 2023–Jan 2024', location: 'Toronto, Ontario',
    href: 'https://www.rbcgam.com/en/ca/?disclaimer', logo: '/logos/rbc.png',
  },
  {
    slug: 'rbc-data-engineer', organization: 'RBC', title: 'Data Engineer',
    team: 'IFRS9 & Credit Analysis · GRM',
    summary: 'Data engineering for credit measurement and stress testing.',
    date: 'Jan–Apr 2023', location: 'Toronto, Ontario',
    href: 'https://www.rbcgam.com/en/ca/?disclaimer', logo: '/logos/rbc.png',
  },
];

export const projects: PortfolioEntry[] = [
  {
    slug: 'research', organization: 'Research project', title: 'Research', category: 'Research',
    summary: 'A space for a research question, the approach, and what I learned.', date: null,
    paragraphs: [], links: [], sample: true,
  },
  {
    slug: 'applied-ai', organization: 'Applied project', title: 'Applied AI', category: 'Project',
    summary: 'A space for something built, tested, and put into practice.', date: null,
    paragraphs: [], links: [], sample: true,
  },
];

export const photos = [
  { src: '/images/personal/photo-04.jpg', width: 2004, height: 3023, alt: 'Smiling in front of the Pike Place Market sign', caption: 'An afternoon at the market.' },
  { src: '/images/personal/photo-01.png', width: 3024, height: 4032, alt: 'Holding a colourful bouquet inside a flower market', caption: 'Flowers, and a little colour.' },
  { src: '/images/personal/photo-02.jpg', width: 3024, height: 4032, alt: 'Seattle skyline and Space Needle beneath the moon at dusk', caption: 'Seattle, after hours.' },
  { src: '/images/personal/photo-03.jpg', width: 1728, height: 3072, alt: 'Standing near the Golden Gate Bridge beneath a pink sunset sky', caption: 'A sunset by the bridge.' },
  { src: '/images/personal/photo-05.jpg', width: 4284, height: 5712, alt: 'Snow-covered mountain peaks above a forest, framed by leaves', caption: 'A little perspective.' },
  { src: '/images/personal/photo-06.jpg', width: 2736, height: 3648, alt: 'Smiling in sunglasses on a mountain trail surrounded by trees', caption: 'Somewhere beyond the screen.' },
  { src: '/images/personal/photo-07.jpg', width: 4284, height: 5712, alt: 'An iced green drink resting on a railing beside leafy plants', caption: 'A small pause.' },
];

export const botMoments = [
  { text: 'A little curious?', mood: 'curious' },
  { text: 'Ask me about Shahmeer.', mood: 'wave' },
  { text: 'Thinking about good questions…', mood: 'thinking' },
  { text: 'Research, building, or a hello?', mood: 'curious' },
  { text: 'Hi there.', mood: 'wave' },
] as const;
