import axios from "axios";
import { ReceiptGetResponse } from "../model/ReceiptGetResponse"; //นำเข้าโมเดลสำหรับเก็บข้อมูลส่วนสำคัญเพื่อนำไปเเสดงผลเเละเขียนไฟล์ csv


const HOST: string = "https://receipt-ocr-app.onrender.com"; 


export class ReceiptService {


  //ฟังก์ชั่นสำหรับหาข้อมูลส่วนสำคัญของรูปภาพใบเสร็จรับเงิน หรือ ใบกำกับภาษี
  async extract_receipt_information(imageFile: File) {

    const url = HOST + "/image/tesseract"; //สร้างเส้นทางสำหรับส่งรูปภาพไปประมวลผลที่ Server

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    const receipt_data: ReceiptGetResponse = response.data;
    return receipt_data; //ทำการส่งข้อมูลส่วนสำคัญของรูปภาพใบเสร็จกลับไป
  }


  //เนื่องจากข้อมูลที่ส่งเข้ามาใน dataExcel เป็น Array 2D เเบบ [[{},{}][{},{}]] โดยจะเก็บข้อมูลทีละ row ที่มีข้อมูล json เเต่ละ column อยู่ข้างใน
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async save_data_to_excel(dataExcel: any[][]) {

    const result: Array<Record<string, string>> = []; //ทำการประกาศตัวเเปร array 1D ที่มีชนิดเป็น Record<string, string>
    console.log(result);
    console.log(dataExcel);


    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataExcel.forEach((row: any[]) => { //วนลูปนำเเต่ละ row ออกมาโดยจะเป็น Array ตัวที่ 2 ที่มีข้อมูล json เเต่ละ column อยู่ข้างใน

      console.log(row);
      const obj: Record<string, string> = {}; //ประกาศตัวเเปร json
      
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      row.forEach((item: any, index: number) => { //วนลูปนำข้อมูลเเต่ละ column ที่เป็น json ของเเต่ละ row ออกมาใช้งาน
        
        const key = `item${index + 1}`; //ทำการสร้าง key ที่เป็นตั้งเเต่ item1 - item8
        obj[key] = item.value;

      });
  
      result.push(obj); //ทำการสร้าง List ที่เก็บข้อมูล json หลายๆตัว โดยที่ json เเต่ละตัวนั้นคือข้อมูลของเเต่ละ row

    });
    console.log(result);
    console.log({result: result});


    const url = HOST + "/write/excel"; //สร้างเส้นทางสำหรับส่งข้อมูลส่วนสำคัญไปเขียนเป็นไฟล์ excel
    const response = await axios.post(url, {
      result: result
    }, {
      responseType: 'blob' //ตั้งค่า axios รับข้อมูลในรูปเเบบของ blob เเทนที่จะเป็น json
    });


    return response.data; //ทำการส่งข้อมูลที่เป็นไฟล์ excel กลับไปให้กับผู้เรียกใช้ เพื่อดาวน์โหลดไฟล์ excel
  }
}
