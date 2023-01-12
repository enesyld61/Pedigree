import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Anket from "./Anket";
import Tree from "./Tree";

function App() {
  const [data, setData] = useState([]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Anket setData={setData} />} />
        <Route path="/tree" element={<Tree data={data} setData={setData} />} />
      </Routes>
    </div>
  );
}

export default App;
