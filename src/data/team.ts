export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  linkedinUrl?: string;
  image?: string;
  bio?: string;
  objectPosition?: string;
}

export const facultyAdvisor: TeamMember = {
  id: "faculty-1",
  name: "Dr. Puneet Chandra Srivastava",
  role: "Dean EII",
  department: "EII Department",
  image: "/Dean EII.webp",
  bio: "Guiding students to innovate and create solutions that matter.",
};

export const coreLeadership: TeamMember[] = [
  { id: "cl-1", name: "Amit Yadav ", role: "President", linkedinUrl: "#", image: "/SAVE_20260119_155045 - Amit Yadav.webp" },
  { id: "cl-2", name: "Shriya Shreyaskar", role: "Vice President", linkedinUrl: "#", image: "/GridArt_20250818_223905918 - Shriya Shreyaskar.webp" },
  { id: "cl-3", name: "Mayank Tyagi", role: "Treasurer", linkedinUrl: "#", image: "/Mayank tyagi.webp" },
  { id: "cl-4", name: "Traymbakesh Mishra", role: "PRO", linkedinUrl: "#", image: "/Traymbakesh Mishra.webp" },
  { id: "cl-5", name: "Aman Sharma", role: "PRO", linkedinUrl: "#", image: "/Aman.webp" },
  { id: "cl-6", name: "Aditya Bhaguna", role: "Assistant Vice President", linkedinUrl: "#", objectPosition: "center 20%", image: "/Aditya.webp" },
  { id: "cl-7", name: "Ankita Pal", role: "Assistant Vice President", linkedinUrl: "#", image: "WhatsApp Image 2026-03-18 at 4.17.34 PM.webp" },
  { id: "cl-8", name: "Archana Chaurshiya", role: "Assistant Vice President", linkedinUrl: "#", image: "/Archana.webp" },
  { id: "cl-9", name: "Prakhar Srivastava", role: "Executive", linkedinUrl: "#", image: "/PXL_20251231_192407161 - Prakhar Srivastava.webp" },
  { id: "cl-10", name: "Shikhar Sachan ", role: "Executive", linkedinUrl: "#", image: "WhatsApp Image 2026-03-25 at 8.06.57 PM.webp" },
  { id: "cl-11", name: "Shiva Adhikari ", role: "Executive", linkedinUrl: "#", image: "WhatsApp Image 2026-03-25 at 8.50.58 PM.webp" },
  { id: "cl-12", name: "Keshav Kumar", role: "General Secretary", linkedinUrl: "#", image: "WhatsApp Image 2026-04-14 at 11.18.39 PM.webp", objectPosition: "center 20%" },
  { id: "cl-13", name: "Krishnav Talukdar", role: "Deputy Secretary", linkedinUrl: "#", image: "/DS.webp" },
];

export const departmentHeads: TeamMember[] = [
  { id: "dh-1", name: "Puneet Chaudhary", role: "Head", department: "FundIncharge", linkedinUrl: "#", image: "/IMG_2904 - puneet chaudhary.webp" },
  { id: "dh-14", name: "Parth Mehra", role: "Head", department: "Management", linkedinUrl: "#", image: "/IMG-20260207-WA0005 - parth Mehra.webp" },
  { id: "dh-15", name: "Utkarsh Tyagi", role: "Co-Head", department: "Management", linkedinUrl: "#", image: "/IMG_20250226_234449_530 - Utkarsh Tyagi.webp" },

  { id: "dh-2", name: "Pranjal Dubey", role: "Head", department: "PublicRelations", linkedinUrl: "#", image: "/IMG_20250405_155938248_HDR_AE - Pranjal Dubey.webp" },
  { id: "dh-3", name: "Prateek Dixit", role: "Co-Head", department: "PublicRelations", linkedinUrl: "#", image: "/retouch_2025091801391880 - Prateek Dixit.webp" },
  { id: "dh-4", name: "Daksh Chaudhary", role: "Head", department: "Designing", linkedinUrl: "#", image: "/Daksh Chaudhary - Daksh Choudhary.webp" },
  { id: "dh-5", name: "Shivam Vashisth", role: "Co-Head", department: "Designing", linkedinUrl: "#", image: "/IMG-20251106-WA0031 - Shivam Vashisth.webp", objectPosition: "center 20%" },
  { id: "dh-6", name: "Ashmit Kumar", role: "Head", department: "Technical", linkedinUrl: "#", image: "/Ashmit kumar.webp" },
  { id: "dh-7", name: "Nikhil Gaurav", role: "Co-Head", department: "Technical", linkedinUrl: "#", image: "WhatsApp Image 2026-03-15 at 8.24.14 PM.webp" },
  { id: "dh-8", name: "Meghna Kandpal", role: "Head", department: "SocialMedia", linkedinUrl: "#", image: "/IMG_1741869018013 - Meghna Kandpal.webp" },
  { id: "dh-9", name: "Vaibhav Srivastava", role: "Co-Head", department: "SocialMedia", linkedinUrl: "#", image: "/DSC_2054 - Vaibhav Srivastava.webp", objectPosition: "center 20%" },

  { id: "dh-10", name: "Prakhar Bajpai", role: "Head", department: "Documentation", linkedinUrl: "#", image: "/IMG_20251105_121044 (1) - PRAKHAR BAJPAI.webp" },
  { id: "dh-11", name: "Ujjwal Goel", role: "Co-Head", department: "Documentation", linkedinUrl: "#", image: "/Ujjwal goel.webp" },
  { id: "dh-12", name: "Saloni Singh", role: "Head", department: "Club Out Reach", linkedinUrl: "#", image: "/B77C1F81-89BF-4D53-9C76-4440F2DB60A7 - Saloni Singh.webp", objectPosition: "center 20%" },
  { id: "dh-13", name: "Nilisha Garg", role: "Co-Head", department: "Club Out Reach", linkedinUrl: "#", image: "/IMG_20260209_200539 - Nilisha Garg.webp" },

];

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Ritesh Yadav ", role: "Member", department: "Event Management", image: "/Screenshot_20260211_122256 - Ritesh Yadav.webp", objectPosition: "center 20%" },
  { id: "tm-2", name: "Sarthak Pandey", role: "Member", department: "Technical Team", image: "/Sarthak pandey.webp" },
  { id: "tm-25", name: "Arpit Yadav", role: "Member", department: "Technical Team", image: "DSC_0270 - DADDY MUKAMBO.webp" },
  { id: "tm-34", name: "Akshat Uniyal ", role: "Member", department: "Content & Social Media", image: "IMG_20251121_231126_040 - DUKEDAD yt.webp" },
  { id: "tm-3", name: "Gagan Kesarwani", role: "Member", department: "Design & Creatives", image: "/IMG_3968_Original - Gagan.webp" },
  { id: "tm-6", name: "Vansh Baisla", role: "Member", department: "Finance & Sponsorship", image: "/Vansh baisla.webp" },

  { id: "tm-4", name: "Vishal Singh", role: "Member", department: "Public Relations", image: "/IMG_8148 - vishal singh.webp" },
  { id: "tm-5", name: "Vansh Tyagi", role: "Member", department: "Content & Social Media", image: "/IMG_20251002_202703_557 - Vansh Tyagi.webp" },
  // { id: "tm-7", name: "Krishna Tyagi ", role: "Member", department: "Event Management" },
  // { id: "tm-8", name: "Avika Tyagi", role: "Member", department: "Technical Team" },
  { id: "tm-9", name: "Harsh Kumar", role: "Member", department: "Technical Team", image: "/IMG_20251217_012622 - Harsh Kumar.webp", objectPosition: "center 20%" },
  { id: "tm-10", name: "Aryan Saini", role: "Member", department: "Technical Team", image: "/IMG-20250920-WA0072 - Aryan Saini.webp" },
  { id: "tm-11", name: "Saanvi Singh ", role: "Member", department: "Technical Team", image: "/Snapchat-1913822228 - Saanvi Singh.webp" },
  // { id: "tm-12", name: "Abhigyan Mittal", role: "Member", department: "Technical Team" },
  { id: "tm-13", name: "Anushka Chikara", role: "Member", department: "Technical Team", image: "/InShot_20260210_110116514 - Anushka Chikara.webp" },
  { id: "tm-14", name: "Samiksha Chaudhary", role: "Member", department: "Technical Team", image: "/IMG_1721 - Samiksha Choudhary.webp", objectPosition: "center 20%" },
  { id: "tm-15", name: "Priyanshu Sharma", role: "Member", department: "Technical Team", image: "/IMG_7282 - Priyanshu.webp", objectPosition: "center 20%" },
  { id: "tm-16", name: "Prince Madhesiya", role: "Member", department: "Technical Team", image: "WhatsApp Image 2026-04-12 at 1.38.47 AM.webp" },
  // { id: "tm-17", name: "Manvi", role: "Member", department: "Technical Team" },
  { id: "tm-18", name: "Ujjwal Vashistha ", role: "Member", department: "Technical Team", image: "/IMG20241031203128~2 - Ujjwal Vashishta.webp", objectPosition: "center 20%" },
  // { id: "tm-19", name: "Nishka Tyagi", role: "Member", department: "Technical Team" },
  { id: "tm-20", name: "Nayan Yadav", role: "Member", department: "Technical Team", image: "/InShot_20251016_204307334 - Nayan Yadav.webp" },
  // { id: "tm-21", name: "Navya Swami ", role: "Member", department: "Technical Team" },
  { id: "tm-22", name: "Omansh Arora", role: "Member", department: "Technical Team", image: "/IMG_20260206_151852 - Omansh Arora.webp" },
  { id: "tm-23", name: "Pushkar Tiwari", role: "Member", department: "Technical Team", image: "IMG_20251116_012717247 - SORA.webp" },
  { id: "tm-24", name: "Rajnikant", role: "Member", department: "Technical Team", image: "WhatsApp Image 2026-04-09 at 3.14.33 AM.webp" },
  { id: "tm-26", name: "Akriti Singh", role: "Member", department: "Technical Team", image: "/IMG_20260209_200629 - Akriti Singh.webp" },
  { id: "tm-27", name: "Archita Prajapati", role: "Member", department: "Content & Social Media", image: "WhatsApp Image 2026-03-25 at 6.33.22 PM.webp" },
  // { id: "tm-28", name: "Adhiya Jha", role: "Member", department: "Content & Social Media" },
  { id: "tm-29", name: "Paridhi Sharma", role: "Member", department: "Content & Social Media", image: "/Screenshot_20260209_195418 - Paridhi Sharma.webp" },
  // { id: "tm-30", name: "Anshit Sharma", role: "Member", department: "Content & Social Media" },
  { id: "tm-31", name: "Ayush Bisht", role: "Member", department: "Content & Social Media", image: "/IMG_20260128_185253_613 - Ayush Bisht.webp" },
  { id: "tm-32", name: "Navya", role: "Member", department: "Content & Social Media", image: "WhatsApp Image 2026-04-10 at 3.35.24 PM.webp" },
  { id: "tm-33", name: "Saizal Verma", role: "Member", department: "Content & Social Media", image: "/IMG_20260130_235312 - SAIZAL VERMA.webp" },
  { id: "tm-35", name: "Pranav Tyagi", role: "Member", department: "Content & Social Media", image: "/DSC_3006 - PRANAV TYAGI.webp" },
  { id: "tm-36", name: "Aditya Chauhan", role: "Member", department: "Content & Social Media", image: "me - ADITYA CHAUHAN.webp", objectPosition: "center 20%" },
  { id: "tm-38", name: "Aakriti Chaudhary ", role: "Member", department: "Content & Social Media", image: "/IMG-20260206-WA0002 - Aakriti Chaudhary.webp" },
  // { id: "tm-39", name: "Kanak", role: "Member", department: "Content & Social Media" },
  { id: "tm-40", name: "Astha Sharma", role: "Member", department: "Content & Social Media", image: "/IMG_20260209_200528 - Aastha Sharma.webp" },
  { id: "tm-41", name: "Abhishek Gupta", role: "Member", department: "Content & Social Media", image: "/IMG20250928175653 - Abhishek Gupta.webp" },
  { id: "tm-42", name: "Nikunj Upadhyay", role: "Member", department: "Content & Social Media", image: "/20260204194806580 - Nikunj Upadhayay.webp" },
  { id: "tm-43", name: "Adiya", role: "Member", department: "Content & Social Media", image: "WhatsApp Image 2026-03-25 at 6.33.39 PM.webp" },
  // { id: "tm-44", name: "Avika Singh", role: "Member", department: "Content & Social Media" },
  { id: "tm-45", name: "Apoorva Singhal ", role: "Member", department: "Content & Social Media", image: "/IMG_20251014_211421~2 - Apoorva Singhal.webp" },

];
