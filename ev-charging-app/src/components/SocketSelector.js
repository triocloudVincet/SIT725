import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plug, Timer } from "lucide-react";

const SocketSelector = ({ station }) => {
  const [selectedSocket, setSelectedSocket] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cost, setCost] = useState(0);

  const sockets = [
    {
      type: "Type 2",
      power: "22kW",
      rate: parseFloat(station?.rate?.replace("$", "")) || 0.35,
    },
    {
      type: station?.sockets?.[1]?.type || "CCS",
      power: station?.sockets?.[1]?.power || "50kW",
      rate: parseFloat(station?.rate?.replace("$", "")) || 0.35,
    },
  ];

  useEffect(() => {
    let interval;
    if (isCharging) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        const hourlyRate = selectedSocket.rate;
        setCost((prev) => prev + hourlyRate / 3600);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCharging, selectedSocket]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const totalCost = (cost + (station?.parkingRate || 2)).toFixed(2);

  return (
    <div className='mt-2 space-y-2 p-4 bg-white rounded-lg shadow-sm'>
      <div className='flex gap-2'>
        {sockets.map((socket) => (
          <Button
            key={socket.type}
            variant={
              selectedSocket?.type === socket.type ? "default" : "outline"
            }
            onClick={() => {
              setSelectedSocket(socket);
              setIsCharging(false);
              setTimer(0);
              setCost(0);
            }}
            size='sm'
            className='flex items-center gap-2'
          >
            <Plug className='h-4 w-4' />
            {socket.type} - {socket.power}
          </Button>
        ))}
      </div>

      {selectedSocket && (
        <div className='space-y-2'>
          <Button
            onClick={() => setIsCharging(!isCharging)}
            variant={isCharging ? "destructive" : "default"}
            className='w-full'
          >
            {isCharging ? "Stop Charging" : "Start Charging"}
          </Button>

          {isCharging && (
            <div className='bg-slate-100 p-4 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Timer className='h-4 w-4' />
                  <span>{formatTime(timer)}</span>
                </div>
                <div>
                  <span className='font-medium'>${totalCost}</span>
                  <span className='text-sm text-gray-500 ml-1'>
                    (incl. parking)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocketSelector;
