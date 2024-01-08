import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import of pages -> always also define the name of the page
import Test from "./pages/test";
import HomePage from "./pages/homePage";
import Navbar from "./modules/components/navbar";
import Register from "./pages/register";
import ExtendedSearch from "./pages/extendedSearch";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/erweiterteSuche" element={<ExtendedSearch />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
