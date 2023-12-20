import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/themes/saga-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
// import "primeicons/primeicons.css"; //icons

// import of pages -> always also define the name of the page
import Test from "./pages/test";
import HomePage from "./pages/homePage";
import Navbar from "./modules/components/navbar";
import { MegaMenu } from "primereact/megamenu";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
