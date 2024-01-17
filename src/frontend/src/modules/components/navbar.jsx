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

  return (
    <>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand href="/">PeerPapers</CNavbarBrand>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
              <CNavItem>
                <CNavLink href="/home" active>
                  Home
                </CNavLink>
              </CNavItem>
              
              <CNavItem>
                <CNavLink href="/upload" active>
                  Upload File
                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
                <CNavLink href="/register">Register/Login</CNavLink>
              </CNavItem> */}
              <CNavItem>
                <CNavLink href="/erweiterteSuche">Erweiterte Suche</CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CForm className="d-flex" onSubmit={handleSubmit}>
              <CFormInput
                type="search"
                className="me-2"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
}

export default Navbar;
