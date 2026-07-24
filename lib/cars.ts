export type PartItem = {
  name: string;
  estPriceRange: string;
  sourcing: string;
};

export type PartCategory = {
  category: string;
  items: PartItem[];
};

export type CarProfile = {
  make: string;
  model: string;
  year: string;
  aliases: string[];
  parts: PartCategory[];
  commonFaults: string[];
};

export const cars: CarProfile[] = [
  {
    make: "Porsche",
    model: "911 GT3",
    year: "2019",
    aliases: ["911 gt3", "gt3", "porsche gt3", "991.2 gt3", "porsche 911"],
    parts: [
      {
        category: "Engine",
        items: [
          {
            name: "4.0L naturally aspirated flat-6 (9A1/70)",
            estPriceRange: "$25,000 - $35,000 (long block, remanufactured)",
            sourcing: "Porsche dealer, specialist rebuilders (e.g. Callas Rennsport)",
          },
          {
            name: "Individual throttle body set",
            estPriceRange: "$2,500 - $4,000",
            sourcing: "Porsche dealer, OEM salvage",
          },
        ],
      },
      {
        category: "Brakes & Suspension",
        items: [
          {
            name: "PCCB carbon ceramic front rotors (pair)",
            estPriceRange: "$4,000 - $6,000",
            sourcing: "Porsche dealer, Brembo (OEM supplier)",
          },
          {
            name: "PASM adaptive damper (each)",
            estPriceRange: "$800 - $1,200",
            sourcing: "Porsche dealer, Bilstein",
          },
        ],
      },
      {
        category: "Exterior",
        items: [
          {
            name: "Swan-neck rear wing assembly",
            estPriceRange: "$3,000 - $5,000",
            sourcing: "Porsche dealer, salvage yards",
          },
          {
            name: "Front bumper w/ ducts (unpainted)",
            estPriceRange: "$1,500 - $2,500",
            sourcing: "Porsche dealer, aftermarket (Tra-Kyoto, CarBahn)",
          },
        ],
      },
      {
        category: "Interior & Wheels",
        items: [
          {
            name: "Center-lock forged wheel (each)",
            estPriceRange: "$1,200 - $2,000",
            sourcing: "Porsche dealer, BBS (OEM supplier)",
          },
          {
            name: "Carbon fiber bucket seat",
            estPriceRange: "$3,500 - $5,500",
            sourcing: "Porsche dealer, Recaro",
          },
        ],
      },
    ],
    commonFaults: [
      "Bore scoring on early 9A1 engines (pre-2021 revisions) — check compression before buying",
      "PCCB rotor cracking from track use, expensive to replace",
      "Door handle mechanism failures (shared with other 991-generation cars)",
      "Coolant pipe degradation on early model years",
    ],
  },
  {
    make: "Nissan",
    model: "GT-R",
    year: "2017",
    aliases: ["gtr", "gt-r", "r35", "nissan gtr", "godzilla"],
    parts: [
      {
        category: "Engine",
        items: [
          {
            name: "VR38DETT 3.8L twin-turbo V6 (long block)",
            estPriceRange: "$12,000 - $18,000",
            sourcing: "Nissan dealer, AMS Performance (reman)",
          },
          {
            name: "Turbocharger pair (IHI stock)",
            estPriceRange: "$2,500 - $4,000",
            sourcing: "Nissan dealer, IHI (OEM supplier)",
          },
        ],
      },
      {
        category: "Brakes & Suspension",
        items: [
          {
            name: "Brembo front caliper (6-piston, each)",
            estPriceRange: "$900 - $1,400",
            sourcing: "Nissan dealer, Brembo",
          },
          {
            name: "Bilstein DampTronic shock (each)",
            estPriceRange: "$700 - $1,100",
            sourcing: "Nissan dealer, Bilstein",
          },
        ],
      },
      {
        category: "Exterior",
        items: [
          {
            name: "Carbon fiber hood",
            estPriceRange: "$2,000 - $3,500",
            sourcing: "Nissan dealer, Seibon (aftermarket)",
          },
          {
            name: "Rear bumper w/ diffuser",
            estPriceRange: "$1,200 - $2,000",
            sourcing: "Nissan dealer, salvage yards",
          },
        ],
      },
      {
        category: "Interior & Wheels",
        items: [
          {
            name: "RAYS forged wheel (each)",
            estPriceRange: "$700 - $1,100",
            sourcing: "Nissan dealer, RAYS (OEM supplier)",
          },
          {
            name: "Dual-clutch transmission mechatronic unit",
            estPriceRange: "$4,000 - $7,000",
            sourcing: "Nissan dealer, specialist rebuilders",
          },
        ],
      },
    ],
    commonFaults: [
      "Transmission judder/chatter at low speed, especially on modified cars",
      "Passenger side turbo failure more common than driver side",
      "Bellhousing/transmission bearing wear on high-mileage examples",
      "Windshield cracking from stone chips due to steep rake angle",
    ],
  },
  {
    make: "BMW",
    model: "M3",
    year: "2015",
    aliases: ["bmw m3", "m3", "f80 m3", "f80"],
    parts: [
      {
        category: "Engine",
        items: [
          {
            name: "S55 3.0L twin-turbo inline-6 (long block)",
            estPriceRange: "$8,000 - $13,000",
            sourcing: "BMW dealer, specialist rebuilders",
          },
          {
            name: "Twin-scroll turbocharger (each)",
            estPriceRange: "$1,200 - $2,000",
            sourcing: "BMW dealer, BorgWarner (OEM supplier)",
          },
        ],
      },
      {
        category: "Brakes & Suspension",
        items: [
          {
            name: "M compound front brake rotor (each)",
            estPriceRange: "$300 - $500",
            sourcing: "BMW dealer, Brembo",
          },
          {
            name: "Electronic damper control shock (each)",
            estPriceRange: "$500 - $850",
            sourcing: "BMW dealer, Bilstein",
          },
        ],
      },
      {
        category: "Exterior",
        items: [
          {
            name: "Carbon fiber roof panel",
            estPriceRange: "$1,800 - $3,000",
            sourcing: "BMW dealer, salvage yards",
          },
          {
            name: "Front bumper w/ M aero kit",
            estPriceRange: "$900 - $1,600",
            sourcing: "BMW dealer, aftermarket (3D Design)",
          },
        ],
      },
      {
        category: "Interior & Wheels",
        items: [
          {
            name: "Forged competition wheel (each)",
            estPriceRange: "$600 - $950",
            sourcing: "BMW dealer, salvage yards",
          },
          {
            name: "M Sport bucket seat",
            estPriceRange: "$1,500 - $2,500",
            sourcing: "BMW dealer",
          },
        ],
      },
    ],
    commonFaults: [
      "Rod bearing wear on S55 engines — listen for knocking, common enough to warrant inspection",
      "Crank hub failure on modified/high-power cars",
      "Cooling system water pump and thermostat failures",
      "Carbon buildup on intake valves from direct injection",
    ],
  },
  {
    make: "Ferrari",
    model: "458 Italia",
    year: "2011",
    aliases: ["458", "458 italia", "ferrari 458", "ferrari"],
    parts: [
      {
        category: "Engine",
        items: [
          {
            name: "4.5L naturally aspirated V8 (long block)",
            estPriceRange: "$40,000 - $60,000",
            sourcing: "Ferrari dealer, specialist rebuilders",
          },
          {
            name: "Exhaust manifold set",
            estPriceRange: "$3,000 - $5,000",
            sourcing: "Ferrari dealer",
          },
        ],
      },
      {
        category: "Brakes & Suspension",
        items: [
          {
            name: "Carbon ceramic front rotor (each)",
            estPriceRange: "$2,500 - $4,000",
            sourcing: "Ferrari dealer, Brembo",
          },
          {
            name: "Magnetorheological damper (each)",
            estPriceRange: "$1,200 - $1,900",
            sourcing: "Ferrari dealer, Delphi",
          },
        ],
      },
      {
        category: "Exterior",
        items: [
          {
            name: "Front bumper w/ active aero flaps",
            estPriceRange: "$4,000 - $7,000",
            sourcing: "Ferrari dealer",
          },
          {
            name: "Engine cover (carbon/glass)",
            estPriceRange: "$2,000 - $3,500",
            sourcing: "Ferrari dealer, salvage yards",
          },
        ],
      },
      {
        category: "Interior & Wheels",
        items: [
          {
            name: "Forged alloy wheel (each)",
            estPriceRange: "$1,500 - $2,500",
            sourcing: "Ferrari dealer",
          },
          {
            name: "Carbon fiber racing seat",
            estPriceRange: "$4,000 - $6,500",
            sourcing: "Ferrari dealer, Sabelt",
          },
        ],
      },
    ],
    commonFaults: [
      "Exhaust manifold cracking, a well-known and expensive recurring issue",
      "Rear wheel bearing wear requiring hub replacement",
      "F1 dual-clutch actuator wear on high-mileage cars",
      "Door pop-out button mechanism failures",
    ],
  },
];
