import React from "react";
import StationCard from "./StationCard";
import SocketSelector from "./components/SocketSelector";

const StationList = ({ stations }) => (
  <div className='space-y-4'>
    {stations.map((station) => (
      <div key={station._id}>
        <StationCard station={station} />
        <SocketSelector station={station} />
      </div>
    ))}
  </div>
);

export default StationList;
