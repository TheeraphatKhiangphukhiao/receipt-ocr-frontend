import { AppBar, Avatar, Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {
  // สำหรับเปลี่ยนหน้า
  const navigate = useNavigate();

  //=========================================================== funtion เปลี่ยนไปหน้า Intro
  function navigateToIntroPage() {
    navigate("/");
  }

  //===========================================================
  return (
    <>
      {/* Navbar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className="Navbar_toolbar">
            <div className="Navbar_toolbar_content">
              {/* ใช้ Avata แสดง logo ที่อยู่ในเครื่องตัวเอง */}
              <Avatar alt="Logo" src={logo} sx={{ width: 80 }} />

              <button
                className="Navbar_toolbar_button"
                onClick={navigateToIntroPage}
              >
                Intro
              </button>
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      {/* ส่วนแสดงผลของหน้าต่างๆ ที่อยู่ใน children ของ part หน้านี้ */}
      <Outlet />
    </>
  );
}
