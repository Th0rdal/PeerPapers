import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import of pages -> always also define the name of the page
import Test from "./pages/test";
import HomePage from "./pages/homePage";
import Navbar from "./modules/components/navbar";
import Register from "./pages/register";
import ExtendedSearch from "./pages/extendedSearch";

import { isAuthenticated } from "./auth";
import Upload from "./pages/upload";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route
          path="/home"
          element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/test"
          element={isAuthenticated() ? <Test /> : <Navigate to="/login" />}
        />

        <Route
          path="/upload"
          element={isAuthenticated() ? <Upload /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
