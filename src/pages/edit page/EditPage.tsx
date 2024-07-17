import "./editpage.css";
import { useLocation } from "react-router-dom";
import { ReceiptService } from "../../services/ReceiptService";
import { useEffect, useState } from "react";
import Spreadsheet, { Matrix } from "react-spreadsheet";
import { Button, Container } from "@mui/material";
import "./editpage.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function EditPage() {
  const location = useLocation();

  const selectedImage = location.state.selectedImage; //ทำการรับรูปภาพที่ส่งมาจากหน้า CreatePage

  const receiptService = new ReceiptService(); //ทำการสร้าง instance ของ ReceiptService เพื่อเรียกใช้งานฟังก์ชั่น

  //create hook
  const navigate = useNavigate(); //useNavigate hook

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setDataExcel([]);
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

  //update ข้อมูลใหม่ทุกครั้งเมื่อมีการคีย์ข้อมูลลงใน spreadsheet
  function setnewdata(newData: Matrix<{ value: string }>) {
    const cleanedData = newData.map(
      (row) => row.map((cell) => ({ value: cell?.value || "" })) // Fallback to empty string if undefined
    );
    setDataExcel(cleanedData);
  }

  //เพิ่มแถวใหม่ใน Spreadsheet
  function addRow() {
    //เราสร้างอ็อบเจ็กต์ใหม่ของข้อมูลโดยใช้ ...data เพื่อคัดลอกข้อมูลที่มีอยู่ และเพิ่มแถวใหม่เข้าไปที่สุดของอาร์เรย์ด้วย [{ value: "A" ...
    const newRow = dataExcel[0].map(() => ({ value: "" })); //สร้างแถวใหม่โดยมีค่าว่างในแต่ละเซลล์
    setDataExcel([...dataExcel, newRow]); //เพิ่มแถวใหม่ลงในข้อมูล
  }

  //เพิ่มคอลัมน์ใหม่ใน Spreadsheet
  function addColumn() {
    const newColumn = dataExcel.map((row) => [...row, { value: "" }]); // เพิ่มเซลล์ใหม่ลงในทุกแถว
    setDataExcel(newColumn); // ตั้งค่าข้อมูลใหม่
  }

  function deleteRow() {
    //รับข้อมูลที่เป็นอาร์เรย์ใหม่ที่ไม่รวมแถวสุดท้ายออกมา
    const newData = dataExcel.slice(0, -1); // สร้างอาร์เรย์ใหม่โดยไม่รวม row สุดท้าย
    setDataExcel(newData);
  }

  function deleteColumn() {
    // เข้าถึง แถวทุกแถว และทำการสร้างอาร์เรย์ใหม่โดยไม่รวม column สุดท้าย
    const newData = dataExcel.map((row) => row.slice(0, -1));
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
    console.log("Hello useEffect !!");

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
  }, [selectedImage]); //dependencies array กำหนดว่าฟังก์ชั่นนี้จะทำงานเมื่อ selectedImage มีการเปลี่ยนเเปลง

  return (
    <>
      <Container fixed sx={{ mt: 5 }}>
        <div className="inline-div">
          <img className="responsive-image" src={URL.createObjectURL(selectedImage)} alt="" />

          <div className="custom-spreadsheet-one">
            {dataExcel.length > 0 ? (
              <Spreadsheet className="custom-spreadsheet-two" data={dataExcel} />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
