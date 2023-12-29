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
                <CNavLink href="/" active>
                  Home
                </CNavLink>
              </CNavItem>
              <CDropdown variant="nav-item" popper={false}>
                <CDropdownToggle color="secondary">Apartments </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="/test">Apartment 1</CDropdownItem>
                  <CDropdownItem href="/apartment2">Apartment 2</CDropdownItem>
                  {/* <CDropdownDivider />
                  <CDropdownItem href="#">Something else here</CDropdownItem> */}
                </CDropdownMenu>
              </CDropdown>

              <CNavItem>
                <CNavLink href="/register">Register/Login</CNavLink>
              </CNavItem>
            </CNavbarNav>
            <CForm className="d-flex">
              <CFormInput type="search" className="me-2" placeholder="Search" />
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
