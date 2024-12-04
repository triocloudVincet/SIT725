import React from "react";
import { Battery, DollarSign, MapPin } from "lucide-react";

const StationCard = ({ station }) => (
  <div className='border rounded-lg p-4 hover:border-blue-500 transition-all'>
    <div className='flex justify-between items-start'>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>{station.name}</h3>
          <span className='text-blue-600 font-medium'>
            {station.distance?.toFixed(1)}km away
          </span>
        </div>
        <p className='text-gray-600 flex items-center gap-1'>
          <MapPin size={16} />
          {station.address}
        </p>

        {/* Availability Status */}
        <div className='mt-2 flex items-center gap-2'>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              station.status === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {station.status}
          </span>
        </div>

        {/* Charging Ports */}
        <div className='mt-3'>
          <div className='flex flex-wrap gap-2'>
            {station.ports.map((port, idx) => (
              <span
                key={idx}
                className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1'
              >
                <Battery size={14} />
                {port.type} - {port.power}kW
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Information */}
        <div className='mt-3 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <DollarSign size={14} />
            <span>${station.pricing.perKwh}/kWh</span>
            {station.pricing.parkingFee > 0 && (
              <span className='ml-2'>
                + ${station.pricing.parkingFee}/hr parking
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StationCard;
