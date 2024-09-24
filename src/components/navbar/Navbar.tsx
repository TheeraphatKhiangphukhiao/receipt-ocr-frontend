import { AppBar, Avatar, Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {

  const navigate = useNavigate(); //สำหรับเปลี่ยนหน้า


  //ฟังก์ชั่นสำหรับ router ไปยังหน้า intro page
  function navigateToIntroPage() {
    navigate("/");
  }

  //ฟังก์ชั่นสำหรับ router ไปยังหน้า create page
  function navigateToCreatePage() {
    navigate("/create");
  }

  
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
                onClick={()=>{ navigateToIntroPage(); }}
              >
                Intro
              </button>

              <button
                className="Navbar_toolbar_button"
                onClick={()=>{ navigateToCreatePage(); }}
              >
                Create
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
