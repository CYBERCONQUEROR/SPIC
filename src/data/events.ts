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
    name: "Ideation 2.0",
    date: "2026-03-11",
    venue: "CRC",
    status: "open",
    category: "competition",
    description: "Inter-college pitch competition where students present innovative ideas to a panel of industry experts and investors.",
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
  {
    id: "coc",
    name: "COC (Clash of Coders)",
    date: "2026-05-07",
    venue: "CRC",
    status: "closed",
    category: "hackathon",
    description: "A competitive coding challenge where developers test their problem-solving skills under time pressure.",
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
    description: "An inspiring TEDx event with 5 speakers and 200+ attendees.",
    attendees: 200,
    speakers: 5,
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
    id: "hack-a-preneur",
    name: "Hack-a-Preneur",
    date: "2025-03-15",
    venue: "CRC",
    status: "ended",
    category: "hackathon",
    description: "24-hour hackathon challenging teams to build startup-ready prototypes.",
    attendees: 150,
    highlightsUrl: "#",
  },
  {
    id: "e-summit-24",
    name: "E-Summit '24",
    date: "2024-09-20",
    venue: "Auditorium",
    status: "ended",
    category: "seminar",
    description: "Entrepreneurship summit with startup showcases, panel discussions, and networking.",
    attendees: 300,
    speakers: 8,
    highlightsUrl: "#",
  },
  {
    id: "ideation-1",
    name: "Ideation 1.0",
    date: "2023-11-15",
    venue: "CRC",
    status: "ended",
    category: "competition",
    description: "The inaugural inter-college pitch competition by SPIC.",
    attendees: 120,
    highlightsUrl: "#",
  },
  {
    id: "zero-to-one",
    name: "Zero to One Workshop",
    date: "2024-02-10",
    venue: "Lab 3",
    status: "ended",
    category: "workshop",
    description: "Workshop on building products from scratch, covering ideation to MVP.",
    attendees: 80,
    highlightsUrl: "#",
  },
  {
    id: "alumni-connect",
    name: "Alumni Connect Session",
    date: "2025-01-18",
    venue: "Seminar Hall",
    status: "ended",
    category: "seminar",
    description: "Interactive session with RKGIT alumni sharing industry insights and career advice.",
    attendees: 100,
    highlightsUrl: "#",
  },
];
