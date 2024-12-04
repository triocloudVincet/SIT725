import React from "react";
import { Clock } from "lucide-react";

const RouteOption = ({ route, isSelected, onSelect }) => (
  <div
    className={`border rounded-lg p-4 cursor-pointer transition-all ${
      isSelected ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"
    }`}
    onClick={() => onSelect(route)}
  >
    <div className='flex justify-between items-start'>
      <div className='flex-1'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold'>Route Option</h3>
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock size={16} />
            {route.totalTime}
          </div>
        </div>

        <div className='space-y-3'>
          {route.chargingStops?.map((stop, idx) => (
            <div key={idx} className='bg-white rounded p-3 border'>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>{stop.station}</span>
                <span className='text-sm text-gray-600'>
                  Charge time: {stop.chargingTime}
                </span>
              </div>
              <div className='mt-2 flex items-center gap-4 text-sm text-gray-600'>
                <span>Arrival: {stop.arrivalCharge}</span>
                <span>→</span>
                <span>Departure: {stop.departureCharge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-3 pt-3 border-t flex justify-between text-sm text-gray-600'>
          <span>Total Distance: {route.totalDistance}</span>
          <span>Total Time: {route.totalTime}</span>
        </div>
      </div>
    </div>
  </div>
);

export default RouteOption;
