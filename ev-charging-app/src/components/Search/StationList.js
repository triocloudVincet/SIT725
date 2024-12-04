import React from "react";
import StationCard from "./StationCard";

const StationList = ({ stations }) => (
  <div className='space-y-4'>
    {stations.map((station) => (
      <StationCard key={station._id} station={station} />
    ))}
  </div>
);

export default StationList;
