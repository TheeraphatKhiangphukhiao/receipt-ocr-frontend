import "./editpage.css";
import { useLocation } from "react-router-dom";
import { ReceiptService } from "../../services/ReceiptService";
import { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Button, Container } from "@mui/material";
import "./editpage.css";
import DownloadIcon from "@mui/icons-material/Download"; //นำไอคอนรูป Download เข้ามาเพื่อนำไปใช้กับ button
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from "react-router-dom";
import React from "react";
import CircularProgress from '@mui/material/CircularProgress';


export default function EditPage() {

  let count : number = 0; //ประกาศตัวเเปรสำหรับนับจำนวนการทำงานของฟังก์ชั่น useEffect เพื่อไม่ให้มันทำงาน 2 ครั้งตอนเปิดมาหน้านี้
  const location = useLocation();

  const selectedImage = location.state.selectedImage; //ทำการรับรูปภาพที่ส่งมาจากหน้า CreatePage

  const receiptService = new ReceiptService(); //ทำการสร้าง instance ของ ReceiptService เพื่อเรียกใช้งานฟังก์ชั่น

  //create hook
  const navigate = useNavigate(); //useNavigate hook


  //ฟังก์ชั่นนี้รับอาร์กิวเมนต์ event ที่เป็นการเปลี่ยนเเปลงจาก input ชนิด file ใน React
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files && event.target.files[0]; //เข้าถึงไฟล์ที่ถูกอัปโหลดใน input

    if (file) { //ตรวจสอบว่าได้เลือกไฟล์หรือไม่

      setDataExcel([]); //ทุกครั้งที่มีการเลือกไฟล์รูปภาพใหม่ ให้ล้างข้อมูลใน spreadsheet ให้เป็น array ว่างเสมอเพื่อรอการประมวลผลภาพใหม่
      navigate("/edit", { 
        state: { selectedImage: file },
      });
    }

  };


  //ทำการประกาศ data excel โดยมีชนิดข้อมูล เป็น array 2D เเละข้างในเป็น json ที่มี key คือ value เเละค่าของมันเป็น string
  const [dataExcel, setDataExcel] = useState<{ value: string }[][]>([
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
  ]);


  //ฟังก์ชั่นสำหรับ update ข้อมูลใน spreadsheet ทุกครั้งที่มีการคีย์ข้อมูลใหม่
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setNewData(newData : any) {
    console.log("Hello setNewData !!!");

    setDataExcel(newData);
  }


  //ฟังก์ชั่นสำหรับนำข้อมูลส่วนสำคัญของใบเสร็จไปเขียนเป็นไฟล์ csv เเล้วดาวน์โหลด
  async function save_data_as_csv() {

    console.log(dataExcel);
    const response = await receiptService.save_data_to_csv(dataExcel); //ทำการส่งข้อมูลไปเขียนไฟล์ เเล้วรับไฟล์ csv กลับมา
    console.log(response);

    const bom = "\uFEFF";
    const blob = new Blob([bom + response], {
      type: "text/csv;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Receipt.csv";
    link.type = "text/csv;charset=utf-8";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  //useEffect จะทำงานทุกครั้งเมื่อมีการ rerender
  useEffect(() => {

    if (count == 0) { //ถ้ามันเป็น 0 เเสดงว่ามันจะทำงานเป็นครั้งเเรก เเต่ถ้ามันมากกว่า 0 เเสดงว่ามันทำงานไปเเล้วจะไม่ให้มันทำงานซํ้าอีกรอบ
      count++;

      console.log("count = " + count);
      console.log("Hello useEffect !!! on EditPage");

      const loadDataAsync = async () => {
        const response = await receiptService.extract_receipt_information(
          selectedImage //ส่งรูปภาพไปเพื่อดึงข้อมูลส่วนสำคัญออกมา
        );
  
        const maxColumns = Math.max(
          ...response.result.map((item) => Object.keys(item).length)
        );
  
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newData = response.result.map((item: any) => {
          const rowData = [];
  
          for (let i = 1; i <= maxColumns; i++) {
            const key = `item${i}`;
            rowData.push({ value: item[key] || "" });
          }
          return rowData;
          
        });
  
        setDataExcel(newData);
      };

      loadDataAsync();
    }

  }, [selectedImage]); //dependencies array กำหนดว่าฟังก์ชั่นนี้จะทำงานเมื่อ selectedImage มีการเปลี่ยนเเปลง


  return (
    <>
      <Container fixed sx={{ mt: 5 }}>
        <div className="inline-div">
          <img className="responsive-image" src={URL.createObjectURL(selectedImage)} alt="" />
          <div className="custom-spreadsheet-one">
            <>
              
                {dataExcel.length > 0 ? (
                  <div className="custom-spreadsheet-two">
                    <Spreadsheet
                      className="custom-spreadsheet-three"
                      data={dataExcel}
                      onChange={setNewData}
                      onKeyDown={(event) => console.log(event.key)}
                    />
                  </div>
                ) : (
                  <div className="custom-loading-spreadsheet">
                    <CircularProgress />
                  </div>
                  
                )}
              

              <Button variant="contained" startIcon={<DownloadIcon />} sx={{ fontFamily: "Kanit", mt: 3, width: "100%" }}
                onClick={() => {
                  save_data_as_csv();
                }}
              >
                Download
              </Button>

              <Button variant="contained" startIcon={<UploadFileIcon />} component="label" sx={{ fontFamily: "Kanit", mt: 1, width: "100%" }}
              >
                Upload file
                <input type="file" hidden onChange={handleFile} />
              </Button>
            </>
          </div>
        </div>
      </Container>
    </>
  );
}
