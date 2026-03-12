export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  linkedinUrl?: string;
  image?: string;
  bio?: string;
}

export const facultyAdvisor: TeamMember = {
  id: "faculty-1",
  name: "Dr. Puneet Chandra Srivastava",
  role: "Dean EII",
  department: "EII Department",
  image: "/Dean EII.jpg",
  bio: "Guiding students to innovate and create solutions that matter.",
};

export const coreLeadership: TeamMember[] = [
  { id: "cl-1", name: "Amit Yadav ", role: "President", linkedinUrl: "#" },
  { id: "cl-2", name: "Shriya Shreyaskar", role: "Vice President", linkedinUrl: "#" },
  { id: "cl-3", name: "Mayank Tyagi", role: "Treasurer", linkedinUrl: "#" },
  { id: "cl-4", name: "Traymbakesh Mishra", role: "PRO", linkedinUrl: "#" },
  { id: "cl-5", name: "Aman Sharma", role: "PRO", linkedinUrl: "#" },
  { id: "cl-6", name: "Aditya Bhuguna", role: "Assistant Vice President", linkedinUrl: "#" },
  { id: "cl-7", name: "Ankita Pal", role: "Assistant Vice President", linkedinUrl: "#" },
  { id: "cl-8", name: "Archana Chaurshiya", role: "Assistant Vice President", linkedinUrl: "#" },
  { id: "cl-9", name: "Prakhar Srivastava", role: "Executive", linkedinUrl: "#" },
  { id: "cl-10", name: "Shikhar Sachan ", role: "Executive", linkedinUrl: "#" },
  { id: "cl-11", name: "Shiva Adhikari ", role: "Executive", linkedinUrl: "#" },
  { id: "cl-12", name: "Keshav Kumar", role: "General Secretary", linkedinUrl: "#" },
  { id: "cl-13", name: "Krishnav Talukdar", role: "Deputy Secretary", linkedinUrl: "#", image: "/DS.jpeg" },
];

export const departmentHeads: TeamMember[] = [
  { id: "dh-1", name: "Puneet Chaudhary", role: "Head", department: "FundIncharge", linkedinUrl: "#" },
  { id: "dh-2", name: "Pranjal Dubey", role: "Head", department: "PublicRelations", linkedinUrl: "#" },
  { id: "dh-2", name: "Prateek Dixit", role: "Co-Head", department: "PublicRelations", linkedinUrl: "#" },
  { id: "dh-2", name: "Daksh Chaudhary", role: "Head", department: "Designing", linkedinUrl: "#" },
  { id: "dh-2", name: "Shivam Vashisth", role: "Co-Head", department: "Designing", linkedinUrl: "#" },
  { id: "dh-2", name: "Ashmit Kumar", role: "Head", department: "Technical", linkedinUrl: "#" },
  { id: "dh-2", name: "Nikhil Gaurav", role: "Co-Head", department: "Technical", linkedinUrl: "#" },
  { id: "dh-2", name: "Meghna Kandpal", role: "Head", department: "SocialMedia", linkedinUrl: "#" },
  { id: "dh-2", name: "Vaibhav Srivastava", role: "Co-Head", department: "SocialMedia", linkedinUrl: "#" },

  { id: "dh-2", name: "Prakhar Bajpai", role: "Head", department: "Documentation", linkedinUrl: "#" },
  { id: "dh-2", name: "Ujjwal Goel", role: "Co-Head", department: "Documentation", linkedinUrl: "#" },
  { id: "dh-2", name: "Saloni Singh", role: "Head", department: "Club Out Reach", linkedinUrl: "#" },
  { id: "dh-2", name: "Nilisha Garg", role: "Co-Head", department: "Club Out Reach", linkedinUrl: "#" },
  { id: "dh-2", name: "Parth Mehra", role: "Head", department: "Management", linkedinUrl: "#" },

  { id: "dh-2", name: "Utkarsh Tyagi", role: "Co-Head", department: "Management", linkedinUrl: "#" },

];

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Akshat Uniyal ", role: "Member", department: "Event Management" },
  { id: "tm-2", name: "Arpit Yadav", role: "Member", department: "Technical Team" },
  { id: "tm-3", name: "Gagan Kesarwani", role: "Member", department: "Design & Creatives" },
  { id: "tm-4", name: "Ritesh Yadav", role: "Member", department: "Public Relations" },
  { id: "tm-5", name: "Sarthak Pandey", role: "Member", department: "Content & Social Media" },
  { id: "tm-6", name: "Vansh Baisla", role: "Member", department: "Finance & Sponsorship" },
  { id: "tm-7", name: "Krishna Tyagi ", role: "Member", department: "Event Management" },
  { id: "tm-8", name: "Avika Tyagi", role: "Member", department: "Technical Team" },
  { id: "tm-9", name: "Harsh Kumar", role: "Member", department: "Technical Team" },
  { id: "tm-10", name: "Aryan Saini", role: "Member", department: "Technical Team" },
  { id: "tm-11", name: "Saanvi Singh ", role: "Member", department: "Technical Team" },
  { id: "tm-12", name: "Abhigyan Mittal", role: "Member", department: "Technical Team" },
  { id: "tm-13", name: "Anushka Chikara", role: "Member", department: "Technical Team" },
  { id: "tm-14", name: "Shamiksha Chaudhary", role: "Member", department: "Technical Team" },
  { id: "tm-15", name: "Priyanshu Sharma", role: "Member", department: "Technical Team" },
  { id: "tm-16", name: "Prince Madhesiya", role: "Member", department: "Technical Team" },
  { id: "tm-17", name: "Manvi", role: "Member", department: "Technical Team" },
  { id: "tm-18", name: "Ujjwal Vashistha ", role: "Member", department: "Technical Team" },
  { id: "tm-19", name: "Nishka Tyagi", role: "Member", department: "Technical Team" },
  { id: "tm-20", name: "Nayan Yadav", role: "Member", department: "Technical Team" },
  { id: "tm-21", name: "Navya Swami ", role: "Member", department: "Technical Team" },
  { id: "tm-22", name: "Omansh Arora", role: "Member", department: "Technical Team" },
  { id: "tm-23", name: "Pushkar Tiwari", role: "Member", department: "Technical Team" },
  { id: "tm-24", name: "Rajnikant", role: "Member", department: "Technical Team" },
  { id: "tm-25", name: "Vansh Tyagi ", role: "Member", department: "Technical Team" },
  { id: "tm-26", name: "Akriti Singh", role: "Member", department: "Technical Team" },
  { id: "tm-27", name: "Archita Prajapati", role: "Member", department: "Content & Social Media" },
  { id: "tm-28", name: "Adhiya Jha", role: "Member", department: "Content & Social Media" },
  { id: "tm-29", name: "Paridhi Sharma", role: "Member", department: "Content & Social Media" },
  { id: "tm-30", name: "Anshit Sharma", role: "Member", department: "Content & Social Media" },
  { id: "tm-31", name: "Ayush Bisht", role: "Member", department: "Content & Social Media" },
  { id: "tm-32", name: "Navya", role: "Member", department: "Content & Social Media" },
  { id: "tm-33", name: "Saizal Verma", role: "Member", department: "Content & Social Media" },
  { id: "tm-34", name: "Vishal Singh ", role: "Member", department: "Content & Social Media" },
  { id: "tm-35", name: "Pranav Tyagi", role: "Member", department: "Content & Social Media" },
  { id: "tm-36", name: "Aditya Chauhan", role: "Member", department: "Content & Social Media" },
  { id: "tm-37", name: "Utkarsh Tyagi", role: "Member", department: "Content & Social Media" },
  { id: "tm-38", name: "Akriti Chaudhary ", role: "Member", department: "Content & Social Media" },
  { id: "tm-39", name: "Kanak", role: "Member", department: "Content & Social Media" },
  { id: "tm-40", name: "Astha Sharma", role: "Member", department: "Content & Social Media" },
  { id: "tm-41", name: "Abhishek Gupta", role: "Member", department: "Content & Social Media" },
  { id: "tm-42", name: "Nikunj Upadhyay", role: "Member", department: "Content & Social Media" },
  { id: "tm-43", name: "Vansh Mishra", role: "Member", department: "Content & Social Media" },
  { id: "tm-44", name: "Avika Singh", role: "Member", department: "Content & Social Media" },
  { id: "tm-45", name: "Apoorva Singh ", role: "Member", department: "Content & Social Media" },

];
