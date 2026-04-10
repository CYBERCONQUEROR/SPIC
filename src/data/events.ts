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
];
