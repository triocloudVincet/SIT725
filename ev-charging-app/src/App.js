// App.js
import EVChargingApp from "./components/EVChargingApp";
import { SocketProvider } from "./context/SocketProvider";
import "./index.css";

function App() {
  return (
    <SocketProvider>
      <div className='App'>
        <EVChargingApp />
      </div>
    </SocketProvider>
  );
}

export default App;
