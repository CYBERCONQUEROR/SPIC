export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: "upcoming" | "open" | "closed" | "ended";
  category: "hackathon" | "workshop" | "talk" | "competition" | "visit" | "seminar";
  description: string;
  attendees?: number;
  speakers?: number;
  highlightsUrl?: string;
  registrationUrl?: string;
  image?: string;
  imageList?: string[]; // List of image filenames in the event folder
}

export const upcomingEvents: Event[] = [
  {
    id: "ideation-2",
    name: "Ideation '26",
    date: "25 & 27 April 2026",
    venue: "Seminal Hall , D Block",
    status: "open",
    category: "competition",
    description: "Intra-college pitch competition where students present innovative ideas to a panel of industry experts and investors.",
    registrationUrl: "#",
  },
  {
    
    id: "tedx-rkgit-2026",
    name: "TEDx RKGIT",
    date: "2026-04-01",
    venue: "D Block",
    status: "closed",
    category: "talk",
    description: "An independently organized TEDx event featuring inspiring talks from thought leaders, innovators, and changemakers.",
    highlightsUrl: "#",
  },
];

export const pastEvents: Event[] = [
  {
    id: "tedx-2025",
    name: "TEDx RKGIT",
    date: "2025-08-22",
    venue: "Seminar Hall",
    status: "ended",
    category: "talk",
    description: "An inspiring TEDx event with 7 speakers and 200+ attendees.",
    attendees: 200,
    speakers: 7 ,
    highlightsUrl: "#",
    imageList: [
      "DSC_1650.jpg",
      "DSC_1691.jpg",
      "DSC_1712.jpg",
      "DSC_1730.jpg",
      "DSC_1775.jpg",
      "DSC_1869.jpg",
      "DSC_1909.jpg",
      "DSC_2021.jpg",
      "SAH06110.jpg",
      "SAH06212.jpg",
      "SAH06231.jpg",
      "SAH06339.jpg",
      "SAH06389.jpg",
      "SAH06409.jpg",
    ],
  },
  {
    id: "spic-gma-2024",
    name: "SPIC x GMA",
    date: "9 October 2024",
    venue: "Seminar Hall",
    status: "ended",
    category: "competition",
    description: "The Ghaziabad Entrepreneurship Mission, launched by the Ghaziabad Management Association (GMA) in collaboration with SkillingYou, is designed to identify and nurture the Top 100 young founders from the city.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-ideation-2023",
    name: "Spic x Ideation",
    date: "5 & 13 May 2023",
    venue: "Seminar Hall",
    status: "ended",
    category: "competition",
    description: "Ideation workshop and competition to foster innovative thinking among students.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-haier-2023",
    name: "Spic x Haier",
    date: "24 April 2023",
    venue: "Seminar Hall",
    status: "ended",
    category: "visit",
    description: "Industrial visit to Haier to gain insights into manufacturing and operations.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-eashwa-2022",
    name: "Spic x E-Ashwa",
    date: "23 December 2022",
    venue: "Seminar Hall",
    status: "ended",
    category: "visit",
    description: "Industrial visit to E-Ashwa to understand the electric vehicle industry.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-upgrade-2022",
    name: "Spic x UpGrad",
    date: "21 December 2022",
    venue: "Seminar Hall",
    status: "ended",
    category: "seminar",
    description: "Collaborative seminar with UpGrad focusing on career growth and upskilling.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-unacademy-2022",
    name: "Spic x Unacademy",
    date: "17 October 2022",
    venue: "Seminar Hall",
    status: "ended",
    category: "talk",
    description: "Session with successful innovator S.K Mondal in collaboration with Unacademy.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-gfg-2022",
    name: "Spic x GFG",
    date: "24 May 2022",
    venue: "Seminar Hall",
    status: "ended",
    category: "talk",
    description: "Interactive session with Sandeep Jain, founder of GeeksforGeeks.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "spic-pw-2022",
    name: "Spic x PW",
    date: "24 January 2022",
    venue: "Seminar Hall",
    status: "ended",
    category: "talk",
    description: "Guest lecture in collaboration with Physics Wallah.",
    attendees: 120,
    highlightsUrl: "#",
  },
];
