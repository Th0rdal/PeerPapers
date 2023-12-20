import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import of pages -> always also define the name of the page 
import Index from "./pages/index";
import Test from "./pages/test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
