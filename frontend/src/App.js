import React, { useContext } from "react"
import Home from "./Pages/Home/Home";
import Room from "./Pages/Room/Room";
import { SocketContext } from "./Socket/Context";

function App() {
  const { showRoom } = useContext(SocketContext);

  return (
    <div>
      {!showRoom ? 
        <Home /> : 
        <Room />
      }
    </div>
  );
}

export default App;
