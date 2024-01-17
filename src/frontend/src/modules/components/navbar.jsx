import React, { useState } from "react";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CCollapse,
  CNavbarToggler,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownDivider,
  CDropdownMenu,
  CForm,
  CFormInput,
  CButton,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchQuery = {
    searchTerm: searchTerm,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Query" + JSON.stringify(searchQuery));
    fetch(`/api/filter?searchQuery=${searchQuery}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response;
      })
      .then((jsonData) => {
        console.log("Response JSON: " + jsonData.status);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
    // Redirect to the register page
    window.location.href = "/";
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            PeerPapers
          </a>
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${visible ? "show" : ""}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/home" active>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/upload">
                  Upload File
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/erweiterteSuche">
                  Erweiterte Suche
                </a>
              </li>
            </ul>
            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                type="search"
                className="form-control me-2"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-outline-danger"
              >
                Search
              </button>
            </form>
            <div className="ms-auto">
              <button
                className="btn"
                style={{ backgroundColor: '#ba4141', color: 'white'}}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
