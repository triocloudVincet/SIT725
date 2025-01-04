import React, { useState, useEffect } from "react";
import { DollarSign, MapPin, Plug, Timer } from "lucide-react";
import Button from "../ui/button";
import { useSocket } from "../../context/SocketProvider";

const StationCard = ({ station }) => {
  const socket = useSocket();
  const [selectedSocket, setSelectedSocket] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    socket.on("chargingStatus", (data) => {
      if (data.stationId === station._id) {
        setIsCharging(data.status === "occupied");
      }
    });

    return () => socket.off("chargingStatus");
  }, [socket, station._id]);

  useEffect(() => {
    let interval;
    if (isCharging) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setCost((prev) => prev + parseFloat(station.pricing.perKwh) / 3600);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCharging, station.pricing.perKwh]);

  const handleCharging = () => {
    if (!isCharging) {
      socket.emit("startCharging", {
        stationId: station._id,
        userId: "user123",
      });
    } else {
      socket.emit("stopCharging", {
        stationId: station._id,
      });
      setTimer(0);
      setCost(0);
    }
    setIsCharging(!isCharging);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
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

          <div className='mt-3'>
            <div className='flex flex-wrap gap-2'>
              {station.ports.map((port, idx) => (
                <Button
                  key={idx}
                  variant={selectedSocket === idx ? "default" : "outline"}
                  onClick={() => {
                    setSelectedSocket(idx);
                    setIsCharging(false);
                    setTimer(0);
                    setCost(0);
                  }}
                  size='sm'
                  className='flex items-center gap-1'
                >
                  <Plug size={14} />
                  {port.type} - {port.power}kW
                </Button>
              ))}
            </div>
          </div>

          {selectedSocket !== null && (
            <div className='mt-3 space-y-2'>
              <Button
                onClick={handleCharging}
                variant={isCharging ? "destructive" : "default"}
                className='w-full'
              >
                {isCharging ? "Stop Charging" : "Start Charging"}
              </Button>

              {isCharging && (
                <div className='bg-slate-100 p-3 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Timer size={14} />
                      <span>{formatTime(timer)}</span>
                    </div>
                    <div>
                      <span className='font-medium'>
                        $
                        {(
                          cost +
                          (timer / 3600) * station.pricing.parkingFee
                        ).toFixed(2)}
                      </span>
                      <span className='text-sm text-gray-500 ml-1'>
                        (incl. parking)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
};

export default StationCard;
