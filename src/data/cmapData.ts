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
    name: "Gate No. 1",
    type: "gate",
    location: "Front of IIHM Building",
    description: "Main student entry; bus available",
  },
  {
    id: "gate-6",
    name: "Gate No. 6",
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
