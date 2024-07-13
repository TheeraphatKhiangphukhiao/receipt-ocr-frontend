import axios from "axios";
import { ReceiptBigCGetResponse } from "../model/ReceiptBigCGetResponse";
import { ReceiptLotusGetResponse } from "../model/ReceiptLotusGetResponse";

const HOST: string = "http://127.0.0.1:8000";

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


  async saveDataAsCSV(dataExcel: any[][]) {
    const result: any[] = [];
    
    // วนลูปผ่านแต่ละแถวของข้อมูล Excel
    dataExcel.forEach((row: any[]) => {
      const obj: any = {};
      row.forEach((item: any, index: number) => {
        const key = `item${index + 1}`;
        obj[key] = item.value; // เปลี่ยนจาก item เป็น item.value
      });
      result.push(obj);
    });

    const url = HOST + "/upload/save/receipt";
    const response = await axios.post(url, {
      result: result
    });
    return response;
  }
}
