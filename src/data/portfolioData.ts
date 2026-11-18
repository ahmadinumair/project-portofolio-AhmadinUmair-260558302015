export type SkillCategory = 'Frontend' | 'Backend & Database' | 'Tools';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  focusNote: string;
  iconSrc?: string;
  iconClassName?: string;
  placeholderCode?: string;
  accentColor: string;
  isPlaceholder?: boolean;
}

export type ProjectCategory = 'Web App' | 'Landing Page' | 'Dashboard UI';

export interface ProjectScreen {
  src: string;
  label: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  details: string;
  technologies: string[];
  thumbnailSrc: string;
  gallery: ProjectScreen[];
  githubUrl?: string;
  demoUrl?: string;
  isFeatured?: boolean;
}

export interface ContactChannel {
  id: 'github' | 'linkedin' | 'instagram' | 'whatsapp' | 'email';
  label: string;
  handle: string;
  href?: string;
  isPlaceholder?: boolean;
  copyValue: string;
}

export const PROFILE_INFO = {
  fullName: 'Ahmadin Umair',
  roleTitle: 'Aspiring Software Developer',
  education: 'Politeknik IDN Bogor',
  major: 'Software Engineering (Teknologi Rekayasa Perangkat Lunak)',
  level: 'Beginner / Student Developer',
  tagline: 'Learning · Building · Growing',
  portraitSrc: '/assets/aistudio/erasebg-transformed_2__9b3d542b.png',
  shortIntro:
    'I am a beginner Software Engineering student at Politeknik IDN Bogor, currently building my foundation in web development and programming through hands-on coursework and personal practice.',
  aboutParagraphs: [
    'I am a beginner Software Engineering student at Politeknik IDN Bogor, currently learning and developing my skills in programming and software development.',
    'I enjoy exploring new technologies, building projects, solving problems, and continuously improving my technical abilities.',
    'My goal is to grow as a software developer through learning, experimentation, and real-world projects.',
  ],
  learningFocus: [
    {
      label: 'Institution',
      value: 'Politeknik IDN Bogor',
    },
    {
      label: 'Program',
      value: 'Teknologi Rekayasa Perangkat Lunak',
    },
    {
      label: 'Current Stage',
      value: 'Beginner Student Developer',
    },
    {
      label: 'Primary Interest',
      value: 'Web Interfaces & Backend Fundamentals',
    },
  ],
};

export const TECHNICAL_SKILLS: SkillItem[] = [
  {
    id: 'html',
    name: 'HTML5',
    category: 'Frontend',
    focusNote: 'Semantic markup and accessible document structure',
    iconSrc: '/assets/aistudio/HTML5_ba83fed4.png',
    accentColor: 'rgba(227, 79, 38, 0.22)',
  },
  {
    id: 'css',
    name: 'CSS3',
    category: 'Frontend',
    focusNote: 'Responsive layouts, Flexbox, Grid, and visual styling',
    iconSrc: '/assets/aistudio/CSS3_4023dd37.png',
    accentColor: 'rgba(21, 114, 182, 0.24)',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend',
    focusNote: 'DOM interaction, client logic, and modern ES syntax',
    iconSrc: '/assets/aistudio/JavaScript_9b2e664f.png',
    accentColor: 'rgba(247, 223, 30, 0.20)',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    focusNote: 'Utility-first styling and consistent design systems',
    iconSrc: '/assets/aistudio/Tailwind_CSS_1e38d7ff.png',
    accentColor: 'rgba(56, 189, 248, 0.24)',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Backend & Database',
    focusNote: 'Server-side fundamentals and dynamic web pages',
    iconSrc: '/assets/aistudio/PHP_1deb9e52.png',
    accentColor: 'rgba(119, 123, 179, 0.24)',
  },
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'Backend & Database',
    focusNote: 'MVC architecture, routing, Blade templates, and CRUD',
    iconSrc: '/assets/aistudio/Laravel_bf5c6f21.png',
    accentColor: 'rgba(255, 45, 32, 0.22)',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Backend & Database',
    focusNote: 'Relational tables, queries, and structured data storage',
    iconSrc: '/assets/aistudio/MySQL_203e2f13.png',
    iconClassName: 'brightness-125 contrast-110',
    accentColor: 'rgba(14, 165, 233, 0.20)',
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Tools',
    focusNote: 'Version tracking, commits, and collaborative repositories',
    iconSrc: '/assets/aistudio/GitHub_f899c6c6.png',
    iconClassName: 'brightness-0 invert',
    accentColor: 'rgba(148, 163, 184, 0.20)',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'nusantaramart',
    title: 'NusantaraMart',
    subtitle: 'E-Commerce Web Application',
    category: 'Web App',
    year: '2026',
    summary:
      'A gadget and lifestyle online store powered by Golang and React, designed for clean product browsing, voucher discounts, and seamless checkout.',
    details:
      'NusantaraMart is a full-stack e-commerce web application built with a Golang backend and React frontend. It emphasizes a clean, responsive interface that makes it effortless for users to browse product categories, search items, apply discount vouchers, and inspect persisted order history.',
    technologies: ['Golang', 'React', 'Tailwind CSS', 'REST API'],
    thumbnailSrc: '/assets/aistudio/Screenshot_2026-11-02_104806.JPG_6670cd23.png',
    gallery: [
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_104806.JPG_6670cd23.png',
        label: 'Storefront Hero & Vouchers',
        caption: 'Promotional launch banner with instant discount codes and category filters.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_104823_7d14bf95.png',
        label: 'Gadget Product Catalog',
        caption: 'Filterable product grid displaying pricing, discounts, stock, and ratings.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_104835_4faaface.png',
        label: 'Order History Modal',
        caption: 'Invoice summary persisted on the Golang backend with QRIS payment status.',
      },
    ],
    githubUrl: 'https://github.com/ahmadinumair',
    isFeatured: true,
  },
  {
    id: 'ahmadinumair-id',
    title: 'ahmadinumair.id',
    subtitle: 'Programming Learning Platform',
    category: 'Landing Page',
    year: '2026',
    summary:
      'A coding education landing page crafted in dark mode with retro pixel accents, featuring framework course tracks, community stats, and a developer profile.',
    details:
      'Designed as an engaging programming learning platform landing page combining modern dark-mode aesthetics with retro pixel typography. Includes course catalogs covering Bootstrap, Tailwind CSS, and Laravel alongside community follower statistics and developer introduction.',
    technologies: ['HTML5', 'Tailwind CSS', 'Bootstrap', 'Laravel'],
    thumbnailSrc: '/assets/aistudio/Screenshot_2026-11-02_100226_30eb2ae5.png',
    gallery: [
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_100226_30eb2ae5.png',
        label: 'Retro Pixel Hero',
        caption: 'Dark-mode hero backdrop paired with yellow retro pixel display typography.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_100245_27e71aeb.png',
        label: 'Stats & Premium Courses',
        caption: 'Community growth counters and framework course tracks for Bootstrap, Tailwind, and Laravel.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_100254_eea758a0.png',
        label: 'Developer Profile & Free Tracks',
        caption: 'About section introducing the creator alongside free introductory learning cards.',
      },
    ],
    githubUrl: 'https://github.com/ahmadinumair',
  },
  {
    id: 'pesantren-darul-ilmi',
    title: 'Pesantren Darul Ilmi',
    subtitle: 'Tahfidz Tracking Dashboard UI Design',
    category: 'Dashboard UI',
    year: '2026',
    summary:
      'A tahfidz management web dashboard UI concept designed for clear, transparent monitoring of student memorization progress, monthly reports, and daily logs.',
    details:
      'Created to simplify visual tracking of student Quran memorization records. The interface presents daily submission metrics, a 30-day progress area chart, 3-month comparative bar graphs, and an organized submission entry workflow.',
    technologies: ['UI/UX Design', 'Dashboard Layout', 'Data Visualization'],
    thumbnailSrc: '/assets/aistudio/Screenshot_2026-11-02_093916_ea7f69e9.png',
    gallery: [
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093916_ea7f69e9.png',
        label: 'Overview & 30-Day Trends',
        caption: 'Summary KPI cards with 30-day submission area chart and category donut breakdown.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093937_3182e13a.png',
        label: 'Monthly Student Report',
        caption: 'Three-month comparative bar chart and monthly progress ledger with PDF export.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093945_a173444f.png',
        label: 'Memorization Entry Form',
        caption: 'Structured form for recording surah, verse ranges, lines, and live scoring.',
      },
    ],
    githubUrl: 'https://github.com/ahmadinumair',
  },
  {
    id: 'smart-campus',
    title: 'Smart Campus',
    subtitle: 'Dark-Theme Academic Dashboard',
    category: 'Dashboard UI',
    year: '2026',
    summary:
      'A dark-theme academic task management dashboard concept helping university students organize daily study workloads, deadlines, and priority alerts efficiently.',
    details:
      'Smart Campus explores a focused dark-mode academic workspace featuring weekly study capacity tracking, task status summaries (To Do, In Progress, Completed), high-priority alerts, calendar scheduling, and early-warning preference controls.',
    technologies: ['Dark Theme UI', 'Task System UI', 'Responsive Grid'],
    thumbnailSrc: '/assets/aistudio/Screenshot_2026-11-02_093500_7012ddf5.png',
    gallery: [
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093500_7012ddf5.png',
        label: 'Academic Overview',
        caption: 'Weekly workload capacity gauge, task status counters, and integrated calendar.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093511_cc777438.png',
        label: 'Preferences & Early Warning',
        caption: 'Student profile controls and smart deadline risk threshold configuration.',
      },
    ],
    githubUrl: 'https://github.com/ahmadinumair',
  },
  {
    id: 'umair-cafe-roastery',
    title: 'UMAIR Cafe & Roastery',
    subtitle: 'Artisanal Coffee & Roastery Web Concept',
    category: 'Landing Page',
    year: '2026',
    summary:
      'An editorial cafe and roastery website concept emphasizing warmth, artisanal craft, fast table reservations, and quick discovery of signature menu items.',
    details:
      'Designed around warm cream tones and editorial serif typography to convey a cozy artisanal coffee atmosphere. Highlights clear navigation for exploring signature creations, filtering the artisanal menu, and reserving a table effortlessly.',
    technologies: ['Editorial Web UI', 'Responsive Design', 'Brand Styling'],
    thumbnailSrc: '/assets/aistudio/Screenshot_2026-11-02_093228_f4f71a61.png',
    gallery: [
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093228_f4f71a61.png',
        label: 'Editorial Brand Hero',
        caption: 'Warm serif headline, café imagery, and quick menu or table booking actions.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093248_5cce8f08.png',
        label: 'Signature Creations',
        caption: 'Curated three-column spotlight of signature espresso, pastry, and brunch plates.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093258_c64071bf.png',
        label: 'Filterable Artisanal Menu',
        caption: 'Category-filtered coffee and bakery grid with instant add-to-order actions.',
      },
      {
        src: '/assets/aistudio/Screenshot_2026-11-02_093317_8bc63a7e.png',
        label: 'Table Reservation Form',
        caption: 'Interactive booking form with date, time slot, party size, and seating preference.',
      },
    ],
    githubUrl: 'https://github.com/ahmadinumair',
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'github.com/ahmadinumair',
    href: 'https://github.com/ahmadinumair',
    copyValue: 'https://github.com/ahmadinumair',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Ahmadin Umair Pasomal Rambe',
    href: 'https://www.linkedin.com/in/ahmadin-umair-pasomal-rambe-75a731427',
    copyValue: 'https://www.linkedin.com/in/ahmadin-umair-pasomal-rambe-75a731427',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@ahd.umr',
    href: 'https://www.instagram.com/ahd.umr?lqvp=MW93dWcwY29nNGtvcw==',
    copyValue: 'https://www.instagram.com/ahd.umr?lqvp=MW93dWcwY29nNGtvcw==',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: '+62 812-8360-8347',
    href: 'https://wa.me/6281283608347',
    copyValue: '+62 812-8360-8347',
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'umairpasomal@gmail.com',
    href: 'mailto:umairpasomal@gmail.com',
    copyValue: 'umairpasomal@gmail.com',
  },
];
