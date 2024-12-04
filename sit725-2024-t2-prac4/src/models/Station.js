import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance", "Offline"],
      default: "Available",
    },
    ports: [
      {
        type: {
          type: String,
          required: true,
        },
        power: Number,
        status: {
          type: String,
          enum: ["Available", "In Use", "Offline"],
          default: "Available",
        },
      },
    ],
    pricing: {
      perKwh: {
        type: Number,
        required: true,
      },
      parkingFee: {
        type: Number,
        default: 0,
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

stationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", stationSchema);
