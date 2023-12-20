import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import of pages -> always also define the name of the page
import Test from "./pages/test";
import HomePage from "./pages/homePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
