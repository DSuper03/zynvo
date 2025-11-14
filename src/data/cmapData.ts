// campusData.ts

export interface CampusItem {
  id: string;
  name: string;
  type: 
    | "gate"
    | "canteen"
    | "library"
    | "lab"
    | "lift"
    | "playground"
    | "facility"
    | "roomSeries";
  location: string;
  description?: string;
}

export const cmapData: CampusItem[] = [
  // ======================
  // GATES
  // ======================
  {
    id: "gate-1",
    name: "Gate No. 6",
    type: "gate",
    location: "Front of IIHM Building",
    description: "Main student entry; bus available",
  },
  {
    id: "gate-2",
    name: "Gate No. 2",
    type: "gate",
    location: "Front of TIU Main Campus Building",
    description: "Secondary student entry; bus available",
  },

  // ======================
  // CANTEENS
  // ======================
  {
    id: "canteen-gseries",
    name: "G-Series Canteen",
    type: "canteen",
    location: "In front of G-Series Building",
  },
  {
    id: "canteen-biryani",
    name: "Biryani Canteen",
    type: "canteen",
    location: "In front of Studio Building",
  },
  {
    id: "canteen-groundfloor",
    name: "Ground Floor Canteen",
    type: "canteen",
    location: "In front of B.Tech building main gate / Parking area",
  },

  // ======================
  // LIBRARY
  // ======================
  {
    id: "library-main",
    name: "Library",
    type: "library",
    location: "Ground floor below BCA Building",
  },

  // ======================
  // FACILITIES
  // ======================
  {
    id: "facility-metallurgical-lab",
    name: "Metallurgical Lab",
    type: "lab",
    location: "Ground Floor, BCA Building (Right-hand side)",
  },
  {
    id: "facility-bathroom-bca",
    name: "Bathroom",
    type: "facility",
    location: "Beside Metallurgical Lab, Ground Floor BCA Building",
  },
  {
    id: "facility-principal-room",
    name: "Principal Room",
    type: "facility",
    location: "Main Entrance Gate, below BCA Building",
  },
  {
    id: "facility-electrical-room",
    name: "Electrical Room",
    type: "facility",
    location: "Ground Floor",
  },

  // ======================
  // LIFTS
  // ======================
  {
    id: "lift-1-8floor",
    name: "Lift A",
    type: "lift",
    location: "Main Building",
    description: "Goes up to 8th floor",
  },
  {
    id: "lift-2-8floor",
    name: "Lift B",
    type: "lift",
    location: "Main Building",
    description: "Goes up to 8th floor",
  },
  {
    id: "lift-3-12floor",
    name: "Lift C",
    type: "lift",
    location: "Main Building",
    description: "Goes up to 10th, 11th, 12th floors",
  },
  {
    id: "lift-4-12floor",
    name: "Lift D",
    type: "lift",
    location: "Main Building",
    description: "Goes up to 10th, 11th, 12th floors",
  },

  // ======================
  // PLAYGROUNDS
  // ======================
  {
    id: "ground-main",
    name: "Main Playground",
    type: "playground",
    location: "In front of Main Campus",
  },
  {
    id: "ground-btech",
    name: "B.Tech Playground",
    type: "playground",
    location: "In front of B.Tech Building",
  },

  // ======================
  // LABS (specific)
  // ======================
  {
    id: "lab-13",
    name: "Lab 13",
    type: "lab",
    location: "3rd Floor",
  },
  {
    id: "lab-11",
    name: "Lab 11",
    type: "lab",
    location: "3rd Floor",
  },
  {
    id: "lab-5",
    name: "Lab 5",
    type: "lab",
    location: "2nd Floor",
  },
  {
    id: "lab-17",
    name: "Lab 17",
    type: "lab",
    location: "5th Floor (Right-hand side)",
  },

  // ======================
  // FACULTY ROOMS
  // ======================
  {
    id: "faculty-cse",
    name: "CSE Faculty Room",
    type: "facility",
    location: "2nd Floor",
  },

  // ======================
  // Smart Rooms
  // ======================
  {
    id: "smartroom-english",
    name: "English Smart Room",
    type: "facility",
    location: "7th Floor",
  },

  // ======================
  // ROOM SERIES (Floor numbering rules)
  // ======================
  {
    id: "rooms-1000",
    name: "1000 Series Rooms",
    type: "roomSeries",
    location: "Ground Floor",
    description: "1001 to 1010",
  },
  {
    id: "rooms-2000",
    name: "2000 Series Rooms",
    type: "roomSeries",
    location: "2nd Floor",
    description: "2001 to 2010",
  },
  {
    id: "rooms-3000",
    name: "3000 Series Rooms",
    type: "roomSeries",
    location: "3rd Floor",
  },
  {
    id: "rooms-4000",
    name: "4000 Series Rooms",
    type: "roomSeries",
    location: "4th Floor",
  },
  {
    id: "rooms-5000",
    name: "5000 Series Rooms",
    type: "roomSeries",
    location: "5th Floor",
  },
  {
    id: "rooms-6000",
    name: "6000 Series Rooms",
    type: "roomSeries",
    location: "6th Floor",
  },
  {
    id: "rooms-7000",
    name: "7000 Series Rooms",
    type: "roomSeries",
    location: "7th Floor",
  },
  {
    id: "rooms-8000",
    name: "8000 Series Rooms",
    type: "roomSeries",
    location: "8th Floor",
  },
];

// ======================
// FLOOR DATA STRUCTURES
// ======================

export interface FloorEntry {
  roomNo: string;
  description: string;
  department: string | null;
}

export interface FloorData {
  floor: string;
  phase: string;
  rooms: FloorEntry[];
}

// -------------------------------------------
// --------------- GROUND FLOOR --------------
// -------------------------------------------

export const groundFloor: FloorEntry[] = [
  { roomNo: "101", description: "Reception", department: "Admin" },
  { roomNo: "102", description: "Central Library", department: null },
  { roomNo: "103", description: "Students' Reading Room", department: "Library" },
  { roomNo: "104", description: "Digital Library", department: "Library" },
  { roomNo: "105", description: "Faculty Reading Room", department: "Library" },
  { roomNo: "106", description: "Medical Room", department: null },
  { roomNo: "107", description: "Counselling Room", department: "Admin" },
  { roomNo: "108", description: "Principal's Office", department: "Admin" },
  { roomNo: "109", description: "Meeting Room (Principal)", department: "Admin" },
  { roomNo: "110", description: "Computer / Design Lab", department: "ME" },
  { roomNo: "112", description: "Mechanical Workshop", department: null },
  { roomNo: "113", description: "Admin Office", department: "Admin" },
];

// -------------------------------------------
// --------------- FIRST FLOOR ---------------
// -------------------------------------------

export const firstFloor: FloorEntry[] = [
  { roomNo: "2001", description: "HoD Room, Meeting Room, Library", department: "IT" },
  { roomNo: "2002", description: "Training & Placement", department: "TPO" },
  { roomNo: "2003", description: "Computer Lab", department: "IT" },
  { roomNo: "2004", description: "TIFAC Lab", department: null },
  { roomNo: "2005", description: "Smart Class Room", department: null },
  { roomNo: "2006", description: "HoD Room & Faculty Room (FT)", department: "FT" },
  { roomNo: "2007", description: "FT Lab", department: "FT" },
  { roomNo: "2008", description: "FT Lab", department: "FT" },
  { roomNo: "2009", description: "FT Lab", department: "FT" },
  { roomNo: "2010", description: "FT Lab", department: "FT" },
  { roomNo: "2011", description: "FT Lab", department: "FT" },
  { roomNo: "2012", description: "FT Lab", department: "FT" },
  { roomNo: "2013", description: "FT Lab", department: "FT" },
  { roomNo: "2014", description: "FT Lab", department: "FT" },
  { roomNo: "2015", description: "FT Lab", department: "FT" },
  { roomNo: "2016", description: "Faculty Room-1 (Dept. of IT)", department: "IT" },
];

// -------------------------------------------
// --------------- SECOND FLOOR --------------
// -------------------------------------------

export const secondFloor: FloorEntry[] = [
  { roomNo: "3001", description: "Computer Lab 1", department: "Central Computing Facility" },
  { roomNo: "3002", description: "Computer Lab 5", department: "Reconfigurable Lab (CSE/ECE)" },
  { roomNo: "3003", description: "Server Room", department: "Server" },
  { roomNo: "3004", description: "English Lab", department: "English" },
  { roomNo: "3006", description: "HoD & Faculty Room (CSE)", department: "CSE" },
  { roomNo: "3007", description: "Computer Lab 9", department: "CSE" },
  { roomNo: "3008", description: "Computer Lab 8", department: "IT" },
  { roomNo: "3009", description: "Computer Lab 7", department: "IT" },
  { roomNo: "3010", description: "Computer Lab 6", department: "CE" },
  { roomNo: "3011", description: "Computer Lab 4", department: null },
  { roomNo: "3012", description: "Computer Lab 3", department: "IT" },
  { roomNo: "3013", description: "Computer Lab 2", department: "CSE" },
];

// -------------------------------------------
// --------------- THIRD FLOOR ---------------
// -------------------------------------------

export const thirdFloor: FloorEntry[] = [
  { roomNo: "4001", description: "Faculty Room", department: "AI & ML" },
  { roomNo: "4002", description: "Smart Class Room", department: "EE" },
  { roomNo: "4003", description: "Computer Lab 11", department: null },
  { roomNo: "4004", description: "Computer Lab 12", department: "ECE" },
  { roomNo: "4005", description: "Seminar Room", department: null },
  { roomNo: "4006", description: "Faculty Room (Mathematics)", department: "Mathematics" },
  { roomNo: "4007", description: "Hardware Lab (CSE)", department: "CSE" },
  { roomNo: "4008", description: "Computer Lab 13", department: "AI & ML" },
  { roomNo: "4009", description: "Computer Lab 9", department: null },
  { roomNo: "4010", description: "Computer Lab 10", department: "Central Computing Facility" },
  { roomNo: "4010A", description: "Meeting Room", department: "ECE" },
  { roomNo: "4011", description: "Basic Electrical Lab", department: "EE" },
  { roomNo: "4012", description: "Chemistry Lab", department: "Chemistry" },
];

// -------------------------------------------
// --------------- FOURTH FLOOR --------------
// -------------------------------------------

export const fourthFloor: FloorEntry[] = [
  { roomNo: "5001", description: "Chemistry Lab", department: null },
  { roomNo: "5002", description: "Smart Class Room", department: null },
  { roomNo: "5003", description: "Class Room", department: "BSH" },
  { roomNo: "5004", description: "Class Room", department: null },
  { roomNo: "5005", description: "Class Room", department: null },
  { roomNo: "5006", description: "Physics Lab", department: "Physics" },
  { roomNo: "5007", description: "Physics Lab", department: "Physics" },
  { roomNo: "5008", description: "Power Room", department: "Power" },
  { roomNo: "5009", description: "HoD & Faculty Room", department: "Physics" },
  { roomNo: "5010", description: "Physics Lab", department: "Physics" },
  { roomNo: "5011", description: "Smart Class Room", department: "CSE" },
  { roomNo: "5012", description: "Class Room", department: "CSE" },
  { roomNo: "5013", description: "Class Room", department: "CSE" },
  { roomNo: "5014", description: "Class Room", department: null },
  { roomNo: "5015", description: "Class Room", department: null },
  { roomNo: "5016", description: "Class Room", department: null },
  { roomNo: "5017", description: "Class Room", department: null },
  { roomNo: "5018", description: "Class Room", department: null },
];

// -------------------------------------------
// --------------- FIFTH FLOOR ---------------
// -------------------------------------------

export const fifthFloor: FloorEntry[] = [
  { roomNo: "6001", description: "Hardware Lab", department: "AIML & CSDS" },
  { roomNo: "6002", description: "Computer Lab 14", department: "AI & ML" },
  { roomNo: "6003", description: "Seminar Hall", department: "IT" },
  { roomNo: "6005", description: "Class Room", department: "BSH" },
  { roomNo: "6006", description: "Class Room", department: null },
  { roomNo: "6007", description: "Faculty Room 2 (IT)", department: "IT" },
  { roomNo: "6009", description: "Class Room", department: null },
  { roomNo: "6010", description: "Class Room", department: "BSH" },
  { roomNo: "6011", description: "Class Room", department: null },
  { roomNo: "6012", description: "Class Room", department: null },
  { roomNo: "6013", description: "Computer Lab 15", department: "IT" },
  { roomNo: "6014", description: "Meeting Room", department: null },
  { roomNo: "6015", description: "Computer Lab 16", department: null },
  { roomNo: "6016", description: "Class Room (Tutorial)", department: "BSH" },
  { roomNo: "6017A", description: "Class Room (M.Tech)", department: null },
  { roomNo: "6017B", description: "CSE M.Tech Lab", department: "CSE" },
  { roomNo: "6018", description: "Computer Lab (Diploma)", department: null },
];

// -------------------------------------------
// --------------- SIXTH FLOOR ---------------
// -------------------------------------------

export const sixthFloor: FloorEntry[] = [
  { roomNo: "7001", description: "Engg. Drawing Lab", department: "Diploma (ME, CE)" },
  { roomNo: "7001A", description: "Class Room (Diploma)", department: "CE" },
  { roomNo: "7001B", description: "Class Room (Diploma)", department: "ME" },
  { roomNo: "7002", description: "Class Room", department: "EIE" },
  { roomNo: "7003", description: "Class Room (Diploma)", department: "CSE" },
  { roomNo: "7004", description: "Class Room", department: "EE" },
  { roomNo: "7005", description: "Class Room (Diploma)", department: "EE" },
  { roomNo: "7006", description: "Class Room", department: "CE" },
  { roomNo: "7007", description: "HoD Room & Faculty Room", department: "CE" },
  { roomNo: "7008", description: "Class Room", department: "EE" },
  { roomNo: "7009", description: "Class Room", department: "BSH" },
  { roomNo: "7010", description: "Class Room (Diploma)", department: "EE" },
  { roomNo: "7011", description: "Class Room (Diploma)", department: "ECE" },
  { roomNo: "7012", description: "Electronics Workshop", department: null },
  { roomNo: "7013", description: "Class Room", department: "FT" },
  { roomNo: "7014", description: "Class Room", department: "EE" },
  { roomNo: "7015", description: "Class Room", department: "EE" },
  { roomNo: "7016", description: "Class Room (CE & ME Sharing)", department: "CE & ME" },
];

// -------------------------------------------
// --------------- SEVENTH FLOOR -------------
// -------------------------------------------

export const seventhFloor: FloorEntry[] = [
  { roomNo: "8001", description: "Class Room", department: "IT" },
  { roomNo: "8002", description: "Smart Class Room", department: null },
  { roomNo: "8003", description: "Class Room", department: "ECE (M.Tech)" },
  { roomNo: "8004", description: "Engineering Drawing Room", department: "ME" },
  { roomNo: "8005", description: "Class Room", department: "ECE" },
  { roomNo: "8006", description: "HoD & Faculty Room", department: "ME" },
  { roomNo: "8007", description: "Class Room", department: null },
  { roomNo: "8008", description: "Class Room", department: "ECE" },
  { roomNo: "8009", description: "Class Room", department: null },
  { roomNo: "8010", description: "Class Room", department: null },
  { roomNo: "8011", description: "Engineering Drawing Room", department: "ME" },
  { roomNo: "8012", description: "Class Room", department: null },
  { roomNo: "8013", description: "Class Room", department: "IT" },
  { roomNo: "8014", description: "Class Room", department: null },
  { roomNo: "8015", description: "Class Room", department: null },
];

// -------------------------------------------
// --------------- EIGHTH FLOOR --------------
// -------------------------------------------

export const eighthFloor: FloorEntry[] = [
  { roomNo: "9001", description: "Faculty Room (HoD, ECE)", department: "ECE" },
  { roomNo: "9002", description: "Digital Electronics Lab", department: "ECE" },
  { roomNo: "9003", description: "Microwave & Antenna Lab", department: "ECE" },
  { roomNo: "9004", description: "Microprocessor Lab", department: "ECE" },
  { roomNo: "9005", description: "Dept. Library / Server Room", department: "ECE" },
  { roomNo: "9006", description: "Smart Class Room", department: null },
  { roomNo: "9007", description: "Faculty Room 2", department: "ECE" },
  { roomNo: "9008", description: "Faculty Room 3", department: "ECE" },
  { roomNo: "9009", description: "Project Lab", department: null },
  { roomNo: "9010", description: "Design Lab", department: null },
  { roomNo: "9011", description: "Solid State Lab", department: null },
  { roomNo: "9012", description: "Analog Electronics Lab", department: "ECE" },
  { roomNo: "9013", description: "Communication Lab", department: "ECE" },
  { roomNo: "9014", description: "Basic Electronics Lab", department: "ECE" },
  { roomNo: "9015", description: "VLSI/DSP/CONTROL Lab", department: "ECE" },
  { roomNo: "9016", description: "M-Tech VLSI Lab", department: "ECE" },
];

// -------------------------------------------
// --------------- COMBINED MASTER DATA ------
// -------------------------------------------

export const campusFloors: FloorData[] = [
  { floor: "Ground Floor", phase: "Phase I", rooms: groundFloor },
  { floor: "First Floor", phase: "Phase III", rooms: firstFloor },
  { floor: "Second Floor", phase: "Phase III", rooms: secondFloor },
  { floor: "Third Floor", phase: "Phase III", rooms: thirdFloor },
  { floor: "Fourth Floor", phase: "Phase III", rooms: fourthFloor },
  { floor: "Fifth Floor", phase: "Phase III", rooms: fifthFloor },
  { floor: "Sixth Floor", phase: "Phase III", rooms: sixthFloor },
  { floor: "Seventh Floor", phase: "Phase III", rooms: seventhFloor },
  { floor: "Eighth Floor", phase: "Phase III", rooms: eighthFloor },
];