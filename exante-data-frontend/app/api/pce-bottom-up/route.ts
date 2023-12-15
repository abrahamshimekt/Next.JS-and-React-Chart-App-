import { NextResponse } from "next/server";
import path from "path";

import fs from 'fs';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'PCE_bottom_up.xlsx');
    
    const data = await parseExcelFile(filePath);
    return NextResponse.json(data, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


function parseExcelFile(relativeFilePath: string) {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.resolve(relativeFilePath);
      
      const fileBuffer = fs.readFileSync(filePath);
      
      const workbook = XLSX.read(fileBuffer, {type: 'buffer'});
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Parse data with headers
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      resolve(data);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      reject(error);
    }
  });
}


