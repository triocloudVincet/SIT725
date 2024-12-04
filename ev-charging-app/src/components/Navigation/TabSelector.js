// src/components/Navigation/TabSelector.js
const TabSelector = ({ activeTab, onTabChange }) => (
  <div className='flex mb-6 bg-white rounded-lg shadow-sm'>
    <button
      className={`flex-1 py-3 ${
        activeTab === "search"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600"
      }`}
      onClick={() => onTabChange("search")}
    >
      Find Stations
    </button>
    <button
      className={`flex-1 py-3 ${
        activeTab === "route"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600"
      }`}
      onClick={() => onTabChange("route")}
    >
      Plan Route
    </button>
  </div>
);

export default TabSelector;
