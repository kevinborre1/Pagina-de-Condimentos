import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { producto, precio, fecha } = body;

    // Ruta del archivo Excel en la raíz del proyecto
    const filePath = path.join(process.cwd(), 'pedidos_yuyos.xlsx');
    let workbook;

    if (fs.existsSync(filePath)) {
      // Si el archivo existe, lo leemos
      const file = fs.readFileSync(filePath);
      workbook = XLSX.read(file, { type: 'buffer' });
    } else {
      // Si no existe, creamos uno nuevo con las cabeceras
      workbook = XLSX.utils.book_new();
      workbook.SheetNames.push('Ventas');
      workbook.Sheets['Ventas'] = XLSX.utils.aoa_to_sheet([['Fecha', 'Producto', 'Precio']]);
    }

    // Obtenemos la hoja y los datos actuales
    const worksheet = workbook.Sheets['Ventas'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];    
    // Agregamos la nueva orden
    data.push([fecha, producto, precio]);

    // Actualizamos la hoja en el libro
    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets['Ventas'] = newWorksheet;

    // Escribimos el archivo de vuelta al disco
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    fs.writeFileSync(filePath, excelBuffer);

    return NextResponse.json({ success: true, message: 'Orden guardada en Excel' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}