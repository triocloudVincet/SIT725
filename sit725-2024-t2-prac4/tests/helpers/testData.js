export const sampleStations = [
  {
    name: "Melbourne CBD ChargeHub",
    address: "200 Spencer Street, Melbourne CBD",
    location: {
      type: "Point",
      coordinates: [144.9558, -37.8183],
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 50, status: "Available" },
    ],
    pricing: {
      perKwh: 0.35,
      parkingFee: 2.0,
    },
  },
  {
    name: "South Melbourne Market",
    address: "322-326 Coventry St, South Melbourne",
    location: {
      type: "Point",
      coordinates: [144.9589, -37.8307],
    },
    status: "Available",
    ports: [
      { type: "Type 2", power: 22, status: "Available" },
      { type: "CCS", power: 150, status: "Available" },
    ],
    pricing: {
      perKwh: 0.4,
      parkingFee: 0,
    },
  },
];

export const generateTestStation = (overrides = {}) => ({
  name: "Test Station",
  address: "Test Address",
  location: {
    type: "Point",
    coordinates: [144.9631, -37.8136],
  },
  status: "Available",
  ports: [{ type: "Type 2", power: 22, status: "Available" }],
  pricing: {
    perKwh: 0.35,
    parkingFee: 0,
  },
  ...overrides,
});
