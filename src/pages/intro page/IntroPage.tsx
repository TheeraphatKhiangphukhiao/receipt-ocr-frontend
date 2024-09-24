import { useNavigate } from "react-router-dom";
import "./intropage.css";

export default function IntroPage() {
  // ตัวเปลี่ยนหน้า
  const navigate = useNavigate();

  //=========================================================== funtion เปลี่ยนไปหน้า Create
  function navigateToCreatePage() {
    navigate("/create");
  }

  return (
    <>
      <div className="IntroPage_body" style={{ fontFamily: 'Kanit' }}>
        <div className="IntroPage_body_texts">
          <h1 className="IntroPage_body_h1">The website converts receipt</h1>
          <h1 className="IntroPage_body_h1">text using optical character</h1>
          <h1 className="IntroPage_body_h1">recognition</h1>

          <br />

          <p className="IntroPage_body_p">
            ช่วยให้คุณสามารถแปลงข้อมูลที่อยู่ในภาพใบเสร็จชำระเงิน
          </p>
          <p className="IntroPage_body_p">ให้มาอยู่ในรูปแบบไฟล์ csv</p>
          <p className="IntroPage_body_p">ได้อย่างง่ายดาย</p>

          <br />

          <button className="IntroPage_body_btn" onClick={navigateToCreatePage}>
            Get Start
          </button>
        </div>
      </div>
    </>
  );
}
