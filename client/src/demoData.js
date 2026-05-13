const DEMO_DATA = {
  car: {
    make: "Ferrari",
    model: "458 Italia",
    year: 2012,
    trim: "Base",
    bodyStyle: "Mid-engine coupe",
    engine: "4.5L Naturally Aspirated V8",
    horsepower: 562,
    torque: "398 lb-ft",
    transmission: "7-speed dual-clutch F1",
    drivetrain: "RWD",
    productionYears: "2009–2015",
    msrpOriginal: "$229,825"
  },
  parts: [
    {
      id: "p1", category: "Engine",
      name: "Engine Assembly (F136 V8)",
      partNumber: "FER-136-458-ASM",
      description: "Complete 4.5L naturally aspirated V8 unit producing 562hp at 9,000rpm. Ferrari's finest naturally aspirated road car engine, featuring flat-plane crankshaft and individual throttle bodies.",
      priceMin: 48000, priceMax: 78000,
      sources: [
        { name: "Ferrari of Newport Beach", type: "OEM Dealer", priceEstimate: 78000 },
        { name: "Forza Motorsport Parts", type: "Independent", priceEstimate: 54000 },
        { name: "Symbolic Motors (Used)", type: "Used/OEM", priceEstimate: 48000 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 24
    },
    {
      id: "p2", category: "Brakes",
      name: "Carbon Ceramic Brake Disc (Front)",
      partNumber: "FER-CCM-458-F",
      description: "Brembo carbon-ceramic front disc measuring 398mm. Provides exceptional stopping power with dramatically reduced unsprung weight compared to cast iron.",
      priceMin: 3200, priceMax: 5800,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 5800 },
        { name: "Brembo Direct", type: "Independent", priceEstimate: 4100 },
        { name: "eBay Motors", type: "Used/OEM", priceEstimate: 3200 }
      ],
      availability: "Limited", difficulty: "Professional Required", laborHours: 4
    },
    {
      id: "p3", category: "Suspension",
      name: "Magnetorheological Shock Absorber",
      partNumber: "FER-MR-458-SH",
      description: "Magneti Marelli magnetorheological damper unit for the Manettino-controlled suspension system. Adjusts damping in real-time based on road conditions.",
      priceMin: 1800, priceMax: 3400,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 3400 },
        { name: "Ricambi America", type: "Independent", priceEstimate: 2200 },
        { name: "Used Import", type: "Used/OEM", priceEstimate: 1800 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 3
    },
    {
      id: "p4", category: "Exhaust",
      name: "Inconel Exhaust Manifold",
      partNumber: "FER-EXH-458-MAN",
      description: "Lightweight Inconel alloy exhaust manifold, responsible for the 458's iconic high-revving exhaust note. Feeds the twin catalytic converters.",
      priceMin: 4200, priceMax: 7500,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 7500 },
        { name: "Capristo Exhausts", type: "Aftermarket", priceEstimate: 5200 },
        { name: "Forza Parts", type: "Used/OEM", priceEstimate: 4200 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 6
    },
    {
      id: "p5", category: "Drivetrain",
      name: "F1 Dual-Clutch Gearbox",
      partNumber: "FER-DCT-458-GBX",
      description: "7-speed dual-clutch transmission capable of shifting in 60 milliseconds. Rear-mounted for optimal weight distribution as a transaxle unit.",
      priceMin: 22000, priceMax: 38000,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 38000 },
        { name: "GP Motor Works", type: "Independent", priceEstimate: 26000 },
        { name: "Salvage Unit", type: "Used/OEM", priceEstimate: 22000 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 18
    },
    {
      id: "p6", category: "Cooling",
      name: "Engine Radiator (Centre)",
      partNumber: "FER-RAD-458-CTR",
      description: "Central aluminium radiator in the tri-radiator cooling system. Works with two side-mounted units to maintain optimal operating temperature.",
      priceMin: 1400, priceMax: 2800,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 2800 },
        { name: "Mishimoto", type: "Aftermarket", priceEstimate: 1900 },
        { name: "Ricambi America", type: "Independent", priceEstimate: 1400 }
      ],
      availability: "In Stock", difficulty: "Professional Required", laborHours: 5
    },
    {
      id: "p7", category: "Body",
      name: "Front Bumper Assembly",
      partNumber: "FER-BMP-458-FR",
      description: "Full carbon fibre or fibreglass front bumper assembly including integrated splitter and air ducts. Pininfarina-designed aerodynamic bodywork.",
      priceMin: 3800, priceMax: 9200,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 9200 },
        { name: "Carbon Revolution", type: "Aftermarket", priceEstimate: 5400 },
        { name: "Used OEM", type: "Used/OEM", priceEstimate: 3800 }
      ],
      availability: "Limited", difficulty: "Moderate", laborHours: 3
    },
    {
      id: "p8", category: "Electrical",
      name: "ECU (Engine Control Unit)",
      partNumber: "FER-ECU-458-MG",
      description: "Magneti Marelli engine management ECU controlling fuel injection, ignition timing, and traction control. Must be programmed to matching VIN.",
      priceMin: 2800, priceMax: 5500,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 5500 },
        { name: "SpeedFactory", type: "Independent", priceEstimate: 3600 },
        { name: "Used/Coded", type: "Used/OEM", priceEstimate: 2800 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 2
    },
    {
      id: "p9", category: "Interior",
      name: "Carbon Fibre Racing Seat (Driver)",
      partNumber: "FER-SEAT-458-CF",
      description: "Lightweight carbon fibre bucket seat with Alcantara trim and integrated seat belt guide. Available in multiple configurations including full racing spec.",
      priceMin: 4500, priceMax: 8800,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 8800 },
        { name: "Sabelt Direct", type: "Independent", priceEstimate: 5900 },
        { name: "Ferrari Exchange", type: "Used/OEM", priceEstimate: 4500 }
      ],
      availability: "Limited", difficulty: "DIY Friendly", laborHours: 1
    },
    {
      id: "p10", category: "Engine",
      name: "Throttle Body Set (8 units)",
      partNumber: "FER-TB-458-SET8",
      description: "Full set of 8 individual throttle bodies for the V8, one per cylinder. Critical for the engine's linear power delivery and high-revving character.",
      priceMin: 2200, priceMax: 4100,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 4100 },
        { name: "Caprari Motorsport", type: "Independent", priceEstimate: 2900 },
        { name: "Used OEM Set", type: "Used/OEM", priceEstimate: 2200 }
      ],
      availability: "Limited", difficulty: "Professional Required", laborHours: 8
    },
    {
      id: "p11", category: "Brakes",
      name: "Brake Caliper (Front, Yellow)",
      partNumber: "FER-CAL-458-FY",
      description: "Brembo 6-piston front brake caliper in signature Ferrari yellow. Paired with the 398mm CCM discs for exceptional heat dissipation.",
      priceMin: 1600, priceMax: 3200,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 3200 },
        { name: "Brembo OEM", type: "Independent", priceEstimate: 2100 },
        { name: "Used Pull", type: "Used/OEM", priceEstimate: 1600 }
      ],
      availability: "In Stock", difficulty: "Moderate", laborHours: 2
    },
    {
      id: "p12", category: "Suspension",
      name: "Front Control Arm (Upper)",
      partNumber: "FER-CTL-458-UF",
      description: "Aluminium double-wishbone upper control arm for the front suspension. Lightweight forged construction for precise steering response.",
      priceMin: 680, priceMax: 1400,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 1400 },
        { name: "Ricambi America", type: "Independent", priceEstimate: 920 },
        { name: "Used OEM", type: "Used/OEM", priceEstimate: 680 }
      ],
      availability: "In Stock", difficulty: "Professional Required", laborHours: 3
    },
    {
      id: "p13", category: "Drivetrain",
      name: "Limited Slip Differential (E-Diff)",
      partNumber: "FER-EDIFF-458",
      description: "Ferrari's electronic limited slip differential, managed by the Vehicle Dynamic Control system. Provides torque vectoring for optimal traction out of corners.",
      priceMin: 5800, priceMax: 11000,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 11000 },
        { name: "GP Works", type: "Independent", priceEstimate: 7400 },
        { name: "Used Unit", type: "Used/OEM", priceEstimate: 5800 }
      ],
      availability: "Special Order", difficulty: "Professional Required", laborHours: 10
    },
    {
      id: "p14", category: "Exhaust",
      name: "Sport Exhaust Valve Actuator",
      partNumber: "FER-EXV-458-ACT",
      description: "Electronically controlled exhaust bypass valve that opens at high RPM for the full 458 exhaust note. Controlled via the Manettino switch.",
      priceMin: 420, priceMax: 890,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 890 },
        { name: "Ricambi America", type: "Independent", priceEstimate: 580 },
        { name: "Used Part", type: "Used/OEM", priceEstimate: 420 }
      ],
      availability: "In Stock", difficulty: "Moderate", laborHours: 1
    },
    {
      id: "p15", category: "Electrical",
      name: "Manettino Steering Wheel Switch",
      partNumber: "FER-MAN-458-SW",
      description: "The iconic five-position Manettino dial on the steering wheel controlling suspension, traction control, and exhaust modes. Wet, Sport, Race, CT Off, ESC Off.",
      priceMin: 380, priceMax: 820,
      sources: [
        { name: "Ferrari Dealer", type: "OEM Dealer", priceEstimate: 820 },
        { name: "Euro Car Parts", type: "Independent", priceEstimate: 520 },
        { name: "Used Wheel Part", type: "Used/OEM", priceEstimate: 380 }
      ],
      availability: "In Stock", difficulty: "Moderate", laborHours: 1
    }
  ],
  faults: [
    {
      id: "f1",
      severity: "Critical",
      title: "HELE System Fuel Pump Failure",
      description: "The High Emotion Low Emission stop-start system's fuel pump is known to fail prematurely, leaving the car stranded. The pump is mounted in an awkward position causing heat-related failures. Ferrari issued a technical service bulletin but no formal recall.",
      affectedYears: "2010–2013",
      frequency: "Common",
      symptoms: [
        "Engine fails to restart after stop-start shutdown",
        "Long cranking before start",
        "Fuel pressure warning on dashboard",
        "Engine cuts out at low speed"
      ],
      repairCostMin: 1800, repairCostMax: 3500,
      diyPossible: false,
      preventionTip: "Disable the HELE system via the centre console button on every drive until the pump is replaced with the updated part."
    },
    {
      id: "f2",
      severity: "High",
      title: "Sticky Interior Plastics & Leather Degradation",
      description: "The soft-touch dashboard and interior trim plastics become sticky and degrade over time due to the chemical composition of the coating used. This affects nearly all early cars and is a known cosmetic but expensive issue.",
      affectedYears: "2009–2012",
      frequency: "Very Common",
      symptoms: [
        "Sticky, tacky feel on dashboard surfaces",
        "Black residue transferring to hands",
        "Leather bolsters cracking prematurely",
        "Peeling trim around air vents"
      ],
      repairCostMin: 3500, repairCostMax: 12000,
      diyPossible: false,
      preventionTip: "Keep the car garaged and use UV-protective interior dressing regularly. Budget for a full interior refresh on cars over 8 years old."
    },
    {
      id: "f3",
      severity: "High",
      title: "Carbon Ceramic Brake Disc Cracking",
      description: "The CCM (Carbon Ceramic Material) brake discs can develop radial cracks if subjected to cold weather braking or if bedded in improperly. Cracked discs must be replaced immediately as failure can be catastrophic at speed.",
      affectedYears: "2009–2015",
      frequency: "Occasional",
      symptoms: [
        "Visible cracks radiating from centre bell",
        "Vibration under heavy braking",
        "Grinding noise at low speed",
        "Uneven brake pedal feel"
      ],
      repairCostMin: 6400, repairCostMax: 18000,
      diyPossible: false,
      preventionTip: "Always warm up the brakes gently for the first 5 minutes of driving, especially in cold weather. Inspect discs visually every 6 months."
    },
    {
      id: "f4",
      severity: "Medium",
      title: "Power Steering Pump Leak",
      description: "The electrically-assisted power steering pump develops seals leaks around 30,000–50,000 miles. The leak contaminates the subframe area and if left unchecked can cause steering assistance to fail suddenly.",
      affectedYears: "2009–2014",
      frequency: "Common",
      symptoms: [
        "Power steering fluid puddle under front of car",
        "Groaning noise when turning at low speed",
        "Increased steering effort",
        "Low fluid warning light"
      ],
      repairCostMin: 900, repairCostMax: 2200,
      diyPossible: false,
      preventionTip: "Check power steering fluid level monthly and inspect the pump area for early signs of seepage at every service."
    },
    {
      id: "f5",
      severity: "Medium",
      title: "Stone Chip & Underbody Damage to Flat Floor",
      description: "The 458's extremely low ride height and flat carbon composite underbody panels are highly susceptible to stone chip damage and scraping on speed bumps or steep driveways. Damage to the floor can cause stress fractures in the carbon.",
      affectedYears: "2009–2015",
      frequency: "Very Common",
      symptoms: [
        "Visible stone chips on lower bumper and sills",
        "Scraping noise over uneven surfaces",
        "Cracked or broken undertray panels",
        "Water ingress into undertray cavity"
      ],
      repairCostMin: 400, repairCostMax: 4500,
      diyPossible: true,
      preventionTip: "Apply clear paint protection film (PPF) to the front bumper, sills, and undertray edges. Use a car ramp when approaching steep driveways."
    },
    {
      id: "f6",
      severity: "Low",
      title: "Rear Window Delamination",
      description: "The polycarbonate rear engine cover window can delaminate and turn yellow or hazy over time due to UV exposure. This is a cosmetic issue but significantly affects the visual appeal of the engine bay.",
      affectedYears: "2009–2013",
      frequency: "Occasional",
      symptoms: [
        "Yellowing or cloudiness of rear window",
        "Bubbling between polycarbonate layers",
        "Visible delamination edges",
        "Engine bay less visible from exterior"
      ],
      repairCostMin: 800, repairCostMax: 2400,
      diyPossible: false,
      preventionTip: "Apply UV-resistant polycarbonate coating annually and store the car away from direct sunlight when not in use."
    }
  ]
};

export default DEMO_DATA;
