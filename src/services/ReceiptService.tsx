import axios from "axios";
import { ReceiptBigCGetResponse } from "../model/ReceiptBigCGetResponse";
import { ReceiptLotusGetResponse } from "../model/ReceiptLotusGetResponse";

const HOST: string = "https://receipt-ocr-app.onrender.com";

export class ReceiptService {

  async getBigCReceiptInformation(imageFile: File) {
    const url = HOST + "/index/receipt/ocr";
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //console.log(response.data);
    const receiptBigC: ReceiptBigCGetResponse = response.data;
    return receiptBigC;
  }

  async getLotusReceiptInformation(imageFile: File) {
    const url = HOST + "/lotus/receipt/ocr";
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //console.log(response.data);
    const receiptLotus: ReceiptLotusGetResponse = response.data;
    return receiptLotus;
  }

  
  //เนื่องจากข้อมูลที่ส่งเข้ามาใน dataExcel เป็น Array 2D เเบบ [[{},{}][{},{}]] โดยจะเก็บข้อมูลทีละ row ที่มีข้อมูล json เเต่ละ column อยู่ข้างใน
  async save_data_to_csv(dataExcel: string[][]) {

    const result: string[] = []; //ทำการประกาศตัวเเปร array 1D ที่มีชนิดเป็น string
    console.log(result);
    console.log(dataExcel);

    dataExcel.forEach((row: string[]) => { //วนลูปนำเเต่ละ row ออกมาโดยจะเป็น Array ตัวที่ 2 ที่มีข้อมูล json เเต่ละ column อยู่ข้างใน

      console.log(row);
      const obj: Record<string, string> = {}; //ประกาศตัวเเปร json
      
      
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      row.forEach((item: any, index: number) => { //วนลูปนำข้อมูลเเต่ละ column ที่เป็น json ของเเต่ละ row ออกมาใช้งาน
        
        const key = `item${index + 1}`; //ทำการสร้าง key ที่เป็นตั้งเเต่ item1 - item8
        obj[key] = item.value;

      });
      const json = JSON.stringify(obj); //ทำการเเปลง obj ไปเป็น json string ก่อนที่จะเพิ่มลงใน result
      result.push(json); //ทำการสร้าง List ที่เก็บข้อมูล json หลายๆตัว โดยที่ json เเต่ละตัวนั้นคือข้อมูลของเเต่ละ row

    });
    console.log(result);
    
    // // วนลูปผ่านแต่ละแถวของข้อมูล Excel
    // dataExcel.forEach((row: any[]) => {
    //   const obj: any = {};
    //   row.forEach((item: any, index: number) => {
    //     const key = `item${index + 1}`;
    //     obj[key] = item.value; // เปลี่ยนจาก item เป็น item.value
    //   });
    //   result.push(obj);
    // });

    // const url = HOST + "/upload/save/receipt";
    // const response = await axios.post(url, {
    //   result: result
    // });
    // return response;
  }
}
