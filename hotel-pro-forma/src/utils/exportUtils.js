import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct default import

export const exportToExcel = (data) => {
  const workbook = XLSX.utils.book_new();

  const formattedData = data.map((item) => ({
    Year: `Year ${item?.year ?? ''}`,
    'Room Revenue': item?.roomRevenue ?? 0,
    'Other Revenue': item?.otherRev ?? 0,
    'Total Revenue': item?.totalRevenue ?? 0,
    'Operating Expenses': item?.operatingCosts ?? 0,
    'Net Operating Income': item?.netOperatingIncome ?? 0,
    'Profit Margin (%)': item?.profitMargin?.toFixed(2) ?? '0.00'
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hotel Pro Forma');
  XLSX.writeFile(workbook, 'hotel_pro_forma.xlsx');
};

export const exportToPDF = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Hotel Pro Forma Summary', 14, 20);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = data.map((item) => [
    `Year ${item?.year ?? ''}`,
    `$${(item?.roomRevenue ?? 0).toLocaleString()}`,
    `$${(item?.otherRev ?? 0).toLocaleString()}`,
    `$${(item?.totalRevenue ?? 0).toLocaleString()}`,
    `$${(item?.operatingCosts ?? 0).toLocaleString()}`,
    `$${(item?.netOperatingIncome ?? 0).toLocaleString()}`,
    `${item?.profitMargin?.toFixed(2) ?? '0.00'}%`
  ]);

  // ✅ Use the imported autoTable function directly
  autoTable(doc, {
    startY: 40,
    head: [[
      'Year',
      'Room Revenue',
      'Other Revenue',
      'Total Revenue',
      'Operating Expenses',
      'Net Operating Income',
      'Profit Margin'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 }
  });

  doc.save('hotel_pro_forma.pdf');
};
