import "./editpage.css";
import { useLocation } from "react-router-dom";
import { ReceiptService } from "../../services/ReceiptService";
import { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Button, Container } from "@mui/material";
import "./editpage.css";
import DownloadIcon from "@mui/icons-material/Download"; //นำไอคอนรูป Download เข้ามาเพื่อนำไปใช้กับ button
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function EditPage() {
  let count: number = 0; //ประกาศตัวเเปรสำหรับนับจำนวนการทำงานของฟังก์ชั่น useEffect เพื่อไม่ให้มันทำงาน 2 ครั้งตอนเปิดมาหน้านี้

  const location = useLocation();

  const selectedImage = location.state.selectedImage; //ทำการรับรูปภาพที่ส่งมาจากหน้า CreatePage

  const receiptService = new ReceiptService(); //ทำการสร้าง instance ของ ReceiptService เพื่อเรียกใช้งานฟังก์ชั่น

  //create hook
  const navigate = useNavigate(); //useNavigate hook

  //ฟังก์ชั่นนี้รับอาร์กิวเมนต์ event ที่เป็นการเปลี่ยนเเปลงจาก input ชนิด file ใน React
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]; //เข้าถึงไฟล์ที่ถูกอัปโหลดใน input

    if (file) {
      //ตรวจสอบว่าได้เลือกไฟล์หรือไม่

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
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }]
  ]);

  //ฟังก์ชั่นสำหรับ update ข้อมูลใน spreadsheet ทุกครั้งที่มีการคีย์ข้อมูลใหม่
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setNewData(newData: any) {
    console.log("Hello setNewData !!!");

    setDataExcel(newData);
  }

  //ฟังก์ชั่นสำหรับนำข้อมูลส่วนสำคัญของใบเสร็จไปเขียนเป็นไฟล์ excel เเล้วดาวน์โหลด
  async function save_data_as_excel() {
    console.log(dataExcel);
    const response = await receiptService.save_data_to_excel(dataExcel); //ทำการส่งข้อมูลไปเขียนไฟล์ เเล้วรับไฟล์ excel กลับมา
    console.log(response);

    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //กำหนดประเภทของ blob ให้ตรงกับไฟล์ Excel ที่เป็น .xlsx
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  }

  //useEffect จะทำงานทุกครั้งเมื่อมีการ rerender
  useEffect(() => {
    if (count === 0) {
      //ถ้ามันเป็น 0 เเสดงว่ามันจะทำงานเป็นครั้งเเรก เเต่ถ้ามันมากกว่า 0 เเสดงว่ามันทำงานไปเเล้วจะไม่ให้มันทำงานซํ้าอีกรอบ
      count++;

      console.log("count = " + count);
      console.log("Hello useEffect !!! on EditPage");

      const loadDataAsync = async () => {
        const response = await receiptService.extract_receipt_information(
          selectedImage //ส่งรูปภาพไปเพื่อดึงข้อมูลส่วนสำคัญออกมา
        );

        const checkResult = response.result.length; //ดึงความยาวของ result ออกมาเช็คว่าเป็น array ว่างหรือไม่

        //ถ้า result มีความยาวไม่เท่ากับ 0 เเสดงว่ามีข้อมูล เเละรูปภาพนั้นถูกต้อง
        if (checkResult !== 0) {
          //การใช้ === หรือ !== ในภาษา typescript จะไม่ใช่เเค่การเช็คว่าข้อมูลเหมือนกันไหมเเต่จะเช็คชนิดข้อมูลด้วย ว่าตรงกันไหม

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

          console.log(newData);

          setDataExcel(newData);
        } else {
          //ถ้าความยาวของ result เท่ากับ 0 เเสดงว่ารูปภาพที่ส่งเข้ามาในระบบไม่ถูกต้อง

          const data_is_empty = [
            //เมื่อรูปภาพไม่ถูกต้อง ทำการกำหนดข้อมูลเป็นค่าว่างทั้งหมด
            [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
            ],
            [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
            ],
            [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
            ],
            [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
            ],
          ];
          console.log("invalid file");
          console.log(response.result);

          confirm(
            "รูปภาพไม่ถูกต้อง กรุณาอัปโหลดรูปภาพใบกำกับภาษีรูปเเบบเต็มของ (makro, bigc, lotus)"
          );
          setDataExcel(data_is_empty);
        }
      };

      loadDataAsync();
    }
  }, [selectedImage]); //dependencies array กำหนดว่าฟังก์ชั่นนี้จะทำงานเมื่อ selectedImage มีการเปลี่ยนเเปลง

  return (
    <>
      <div className="edit_page_body">
        <Container fixed sx={{ mt: 10 }}>
          <div className="inline-div">
            <img
              className="responsive-image"
              src={URL.createObjectURL(selectedImage)}
              alt=""
            />
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
                    <CircularProgress color="inherit" />
                  </div>
                )}

                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ fontFamily: "Kanit", mt: 3, width: "100%", backgroundColor: '#FF9900', color: '#292F33', '&:hover': { backgroundColor: '#FF9900' } }}
                  onClick={() => {
                    save_data_as_excel();
                  }}
                >
                  Download excel
                </Button>

                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  component="label"
                  sx={{ fontFamily: "Kanit", mt: 1, width: "100%", backgroundColor: '#FF9900', color: '#292F33', '&:hover': { backgroundColor: '#FF9900' } }}
                >
                  Upload file
                  <input type="file" hidden onChange={handleFile} />
                </Button>
              </>
            </div>
          </div>
          <br />
        </Container>
      </div>
    </>
  );
}
