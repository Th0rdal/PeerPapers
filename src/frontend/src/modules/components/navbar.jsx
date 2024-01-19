import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [rank, setRank] = useState("");

  const navigate = useNavigate();
  const token = Cookies.get("token");

  const logout = async (e) => {
    Cookies.remove("token");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Query" + JSON.stringify(searchQuery));
  };

  useEffect(() => {
    axios
      .get(`api/rank`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setRank(response.data);
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [rank]);

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
                  Home/Bookmarks
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="/rangliste" active>
                  Rangliste
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink href="/upload" active>
                  Datei Hochladen
                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
                <CNavLink href="/register">Register/Login</CNavLink>
              </CNavItem> */}
              <CNavItem>
                <CNavLink href="/erweiterteSuche">
                  Suche/Erweitertesuche
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CForm className="d-flex" onSubmit={handleSubmit}>
              {/* <CFormInput
                type="search"
                className="me-2"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton> */}
              <CButton color="success" variant="outline" onClick={logout}>
                Logout
              </CButton>
              <p className="ms-4">Rang: {rank}</p>
            </CForm>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
}

export default Navbar;
