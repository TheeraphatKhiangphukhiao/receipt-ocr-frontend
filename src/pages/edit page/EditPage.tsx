import "./editpage.css";
import { useLocation } from "react-router-dom";
import { ReceiptService } from "../../services/ReceiptService";
import { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Button } from "@mui/material";
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
  const selectedImage = location.state.selectedImage;


  const receiptService = new ReceiptService();


  // create hook
  const navigate = useNavigate(); // useNavigate hook


  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      //setImageName(file.name);
      //setSelectedImage(file);

      setDataExcel([]);
      navigate("/edit", {
        state: { selectedImage: file },
      });
    }
  };

  const [dataExcel, setDataExcel] = useState([
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],//jklmnopqrstuvwxyz
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
    //[{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }, { value: 'E' }],
  ]);
  // update ข้อมูลใหม่ทุกครั้งเมื่อมีการคีย์ข้อมูลใน Spreadsheet
  function setnewdata(newData: SetStateAction<{ value: string }[][]>) {
    console.log(newData[0][1]["value"]);
    // console.log(newData);
    setDataExcel(newData);
  }

  // เพิ่มแถวใหม่ใน Spreadsheet
  function addRow() {
    // เราสร้างอ็อบเจ็กต์ใหม่ของข้อมูลโดยใช้ ...data เพื่อคัดลอกข้อมูลที่มีอยู่ และเพิ่มแถวใหม่เข้าไปที่สุดของอาร์เรย์ด้วย [{ value: "A" ...
    const newRow = dataExcel[0].map((cell) => ({ value: "" })); // สร้างแถวใหม่โดยมีค่าว่างในแต่ละเซลล์
    setDataExcel([...dataExcel, newRow]); // เพิ่มแถวใหม่ลงในข้อมูล
  }

  // เพิ่มคอลัมน์ใหม่ใน Spreadsheet
  function addColumn() {
    const newColumn = dataExcel.map((row) => [...row, { value: "" }]); // เพิ่มเซลล์ใหม่ลงในทุกแถว
    setDataExcel(newColumn); // ตั้งค่าข้อมูลใหม่
  }

  function selectData() {
    console.log(dataExcel);
  }

  function deleteRow() {
    // รับข้อมูลที่เป็นอาร์เรย์ใหม่ที่ไม่รวมแถวสุดท้ายออกมา
    const newData = dataExcel.slice(0, -1); // สร้างอาร์เรย์ใหม่โดยไม่รวม row สุดท้าย
    setDataExcel(newData);
  }

  function deleteColumn() {
    // เข้าถึง แถวทุกแถว และทำการสร้างอาร์เรย์ใหม่โดยไม่รวม column สุดท้าย
    const newData = dataExcel.map((row) => row.slice(0, -1));
    setDataExcel(newData);
  }


  async function saveDataAsCSV() {

    console.log(dataExcel);
    const response = await receiptService.save_data_to_csv(dataExcel);
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

  useEffect(() => {
        const loadDataAsync = async () => {
          const response = await receiptService.extract_receipt_information(
            selectedImage
          );

          const maxColumns = Math.max(
            ...response.result.map((item) => Object.keys(item).length)
          );
          const newData = response.result.map((item) => {
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
      
  }, [selectedImage]);

  return (
    <>
      {/* <Container fixed> */}


        <div className="editpage_body">
          <div className="editpage_body_show1_buttoms_and_image">
            <div className="editpage_body_show1_buttoms">
                {/* ============================== ปุ่มเพิ่มรูแภาพใหม่ */}
              <Button
                sx={{
                  borderRadius: "30px",
                  border: "3px solid rgba(22, 49, 114, 1)",
                  color: "rgba(22, 49, 114, 1)",
                  paddingLeft: 2,
                  paddingRight: 4,
                  textTransform: "lowercase",
                  fontFamily: "Kanit",
                  fontSize: "18px",
                  // mt: 10,
                }}
                variant="outlined"
                component="label"
              >
                <AddPhotoAlternateIcon sx={{ width: 30, height: 30 }} />
                New
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFile}
                />
              </Button>
            </div>

            <img
              className="editpage_body_show1_image"
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
            />
          </div>



    
          <div className="editpage_body_show2_buttoms_and_spreadsheet">

                <div className="editpage_body_show2_buttoms">
                  {/*==================================================================== add Row and delete Row */}
                  <div className="editpage_body_show2_buttoms_addRow_save_dleteRow">
                    {/* =================== add Row */}
                    <button
                      className="editpage_body_show2_buttoms_addRow_addColumn"
                      onClick={addRow}
                      >
                        <AddIcon sx={{ fontSize: "20px" }} />
                        <span>Row</span>
                    </button>

                    {/* =================== delete Row */}
                    <button
                      className="editpage_body_show2_buttoms_deleteRow_deleteColumn"
                      onClick={deleteRow}
                    >
                      <RemoveIcon sx={{ fontSize: "20px" }} />
                      <span>Row</span>
                    </button>
                  </div>

                  {/*================================================================== save */}
                  <button
                    className="editpage_body_show2_buttoms_save"
                    onClick={saveDataAsCSV}
                  >
                    <SaveAsIcon sx={{ fontSize: "20px" }} />
                    <span>Save</span>
                  </button>

                  {/*=================================================================== delete Column and delete Column */}
                  <div className="editpage_body_show2_buttoms_addColumn_save_dleteColumn">
                    {/* =================== add Column */}
                    <button
                      className="editpage_body_show2_buttoms_addRow_addColumn"
                      onClick={addColumn}
                    >
                      <AddIcon sx={{ fontSize: "20px" }} />
                      <span>Column</span>
                    </button>

                    {/* =================== delete Column */}
                    <button
                      className="editpage_body_show2_buttoms_deleteRow_deleteColumn"
                      onClick={deleteColumn}
                    >
                      <RemoveIcon sx={{ fontSize: "20px" }} />
                      <span>Column</span>
                    </button>
                  </div>
                </div>


                <div className="editpage_body_show2_spreadsheet">
                  {dataExcel.length > 0 ? (
                    <Spreadsheet
                      className="editpage_body_show2_custom_spreadsheet"
                      data={dataExcel}
                      onChange={setnewdata}
                      onKeyDown={(event) => console.log(event.key)}
                    />
                  ) : (
                    <div className="editpage_body_show2_spreadsheet_loading">
                      <CircularProgress />
                    </div>
                  )}
                </div>

          </div>

        </div>


      {/* </Container> */}
    </>
  );
}
