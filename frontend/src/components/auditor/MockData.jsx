export const mockCompanies = [
  {
    id: 1,
    name: "AeroHydrogen Inc.",
    role: "Producer",
    registered: "2025-01-15",
    flagged: false,
    contact: "contact@aerohydro.com",
    productionTotal: 12500, // in MWh
    transactions: [
      {
        id: "T001",
        date: "2025-08-20",
        type: "Sale",
        amount: 500,
        to: "EcoFuel Buyers",
      },
      {
        id: "T002",
        date: "2025-07-11",
        type: "Sale",
        amount: 1200,
        to: "Clean Grid Co.",
      },
    ],
  },
  {
    id: 2,
    name: "BioFuel Buyers",
    role: "Buyer",
    registered: "2025-02-20",
    flagged: false,
    contact: "purchasing@biofuel.com",
    purchaseTotal: 8500, // in MWh
    transactions: [
      {
        id: "T005",
        date: "2025-08-01",
        type: "Purchase",
        amount: 300,
        from: "HydroGen Solutions",
      },
      {
        id: "T006",
        date: "2025-06-25",
        type: "Purchase",
        amount: 1500,
        from: "PureSource Energy",
      },
    ],
  },
  {
    id: 3,
    name: "CleanEnergy Corp",
    role: "Producer",
    registered: "2025-03-10",
    flagged: true,
    contact: "info@cleanenergy.dev",
    productionTotal: 9800,
    transactions: [
      {
        id: "T003",
        date: "2025-08-15",
        type: "Sale (Blocked)",
        amount: 450,
        to: "N/A",
      },
      {
        id: "T004",
        date: "2025-07-22",
        type: "Sale",
        amount: 950,
        to: "BioFuel Buyers",
      },
    ],
  },
  {
    id: 4,
    name: "Grid Stability Partners",
    role: "Buyer",
    registered: "2025-04-05",
    flagged: false,
    contact: "ops@gridstability.com",
    purchaseTotal: 22000,
    transactions: [
      {
        id: "T007",
        date: "2025-08-18",
        type: "Purchase",
        amount: 4000,
        from: "AeroHydrogen Inc.",
      },
    ],
  },
  {
    id: 5,
    name: "HydroGen Solutions",
    role: "Producer",
    registered: "2025-05-12",
    flagged: false,
    contact: "sales@hydrogensolutions.net",
    productionTotal: 31000,
    transactions: [
      {
        id: "T008",
        date: "2025-08-19",
        type: "Sale",
        amount: 2500,
        to: "Grid Stability Partners",
      },
    ],
  },
].sort((a, b) => a.name.localeCompare(b.name)); // Pre-sorted A-Z
