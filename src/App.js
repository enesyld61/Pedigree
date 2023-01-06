import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Anket from "./Anket";
import Tree from "./Tree";

function App() {
  const [data, setData] = useState([]);
  return (
    <div className="App">
      <Link to="/">
        <Button variant="primary">Ana Menü</Button>
      </Link>
      <Routes>
        <Route path="/" element={<Anket setData={setData} />} />
        <Route path="/tree" element={<Tree data={data} setData={setData} />} />
      </Routes>
    </div>
  );
}

export default App;
