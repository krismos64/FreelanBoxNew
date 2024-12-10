import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Quote, Invoice } from '@/types';
import { formatCurrency } from './format';

const generateHeader = (doc: jsPDF, title: string, date: string, companyInfo: any) => {
  doc.setFontSize(24);
  doc.text(title, 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Date : ${format(new Date(date), 'PP', { locale: fr })}`, 20, 45);
  
  // Company info
  doc.setFontSize(10);
  const companyLines = [
    companyInfo.name,
    companyInfo.address,
    `${companyInfo.postalCode} ${companyInfo.city}`,
    `Tél : ${companyInfo.phone}`,
    `Email : ${companyInfo.email}`,
    `SIRET : ${companyInfo.siret}`,
  ];
  
  companyLines.forEach((line, index) => {
    doc.text(line, 20, 70 + (index * 5));
  });
};

const generateClientInfo = (doc: jsPDF, client: any) => {
  doc.setFontSize(12);
  doc.text('Client :', 120, 70);
  
  doc.setFontSize(10);
  const clientLines = [
    client.name,
    client.company,
    client.address,
  ].filter(Boolean);
  
  clientLines.forEach((line, index) => {
    doc.text(line, 120, 80 + (index * 5));
  });
};

const generateItemsTable = (doc: jsPDF, items: any[], startY: number) => {
  const columns = ['Description', 'Quantité', 'Prix unitaire', 'Total'];
  const columnWidths = [80, 25, 35, 35];
  let y = startY;

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y - 5, 175, 10, 'F');
  doc.setFontSize(10);
  
  let x = 20;
  columns.forEach((col, i) => {
    doc.text(col, x, y);
    x += columnWidths[i];
  });
  
  y += 15;

  // Table rows
  items.forEach(item => {
    x = 20;
    doc.text(item.description, x, y);
    x += columnWidths[0];
    doc.text(String(item.quantity), x, y);
    x += columnWidths[1];
    doc.text(formatCurrency(item.unitPrice), x, y);
    x += columnWidths[2];
    doc.text(formatCurrency(item.total), x, y);
    y += 10;
  });

  return y;
};

export const generateQuotePDF = (quote: Quote, companyInfo: any): jsPDF => {
  const doc = new jsPDF();
  
  generateHeader(doc, `Devis ${quote.number}`, quote.date, companyInfo);
  doc.text(`Valable jusqu'au : ${format(new Date(quote.validUntil), 'PP', { locale: fr })}`, 20, 55);
  
  generateClientInfo(doc, quote.client);
  
  const y = generateItemsTable(doc, quote.items, 120);
  
  // Total
  doc.setFontSize(12);
  doc.text(`Total TTC : ${formatCurrency(quote.total)}`, 140, y + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.text('TVA non applicable, article 293 B du CGI', 20, 280);
  
  return doc;
};

export const generateInvoicePDF = (invoice: Invoice, companyInfo: any): jsPDF => {
  const doc = new jsPDF();
  
  generateHeader(doc, `Facture ${invoice.number}`, invoice.date, companyInfo);
  doc.text(`Date d'échéance : ${format(new Date(invoice.dueDate), 'PP', { locale: fr })}`, 20, 55);
  
  generateClientInfo(doc, invoice.client);
  
  const y = generateItemsTable(doc, invoice.items, 120);
  
  // Total
  doc.setFontSize(12);
  doc.text(`Total TTC : ${formatCurrency(invoice.total)}`, 140, y + 10);
  
  // Footer
  doc.setFontSize(8);
  doc.text('TVA non applicable, article 293 B du CGI', 20, 280);
  
  return doc;
};