import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import type { Quote, Invoice } from "@/types";
import { formatCurrency } from "./format";

const STYLE = {
  colors: {
    header: [240, 240, 240] as [number, number, number],
    borders: [220, 220, 220] as [number, number, number],
    text: [60, 60, 60] as [number, number, number],
    textLight: [120, 120, 120] as [number, number, number],
  },
  fonts: {
    normal: "helvetica",
    bold: "helvetica-bold",
  },
  sizes: {
    title: 20,
    subtitle: 12,
    normal: 10,
    small: 8,
  },
  margins: {
    page: 20,
    section: 10,
  },
};

const generateHeader = (
  doc: jsPDF,
  docType: "FACTURE" | "DEVIS",
  documentInfo: {
    number: string;
    date: string;
    validUntil?: string;
    dueDate?: string;
  },
  companyInfo: any
) => {
  // En-tête avec titre et informations document
  doc.setFillColor(...STYLE.colors.header);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

  // Titre à gauche
  doc.setFont(STYLE.fonts.bold);
  doc.setFontSize(STYLE.sizes.title);
  doc.text(docType, STYLE.margins.page, 30);

  // Informations document à droite
  doc.setFontSize(STYLE.sizes.normal);
  doc.text(`N° ${documentInfo.number}`, doc.internal.pageSize.width - 60, 15);
  doc.text(
    `Date : ${format(new Date(documentInfo.date), "dd/MM/yyyy")}`,
    doc.internal.pageSize.width - 60,
    25
  );

  if (documentInfo.validUntil) {
    doc.text(
      `Validité : ${format(new Date(documentInfo.validUntil), "dd/MM/yyyy")}`,
      doc.internal.pageSize.width - 60,
      35
    );
  }
  if (documentInfo.dueDate) {
    doc.text(
      `Échéance : ${format(new Date(documentInfo.dueDate), "dd/MM/yyyy")}`,
      doc.internal.pageSize.width - 60,
      35
    );
  }

  // Section informations entreprise
  const companyLines = [
    companyInfo.name,
    companyInfo.address,
    `${companyInfo.postalCode} ${companyInfo.city}`,
    `Tél : ${companyInfo.phone}`,
    `Email : ${companyInfo.email}`,
  ].filter(Boolean);

  const lineHeight = 7;
  const boxHeight = companyLines.length * lineHeight + 10;

  doc.setFillColor(...STYLE.colors.borders);
  doc.roundedRect(
    STYLE.margins.page,
    50,
    doc.internal.pageSize.width / 2 - 30,
    boxHeight,
    2,
    2,
    "F"
  );

  doc.setFont(STYLE.fonts.normal);
  doc.setFontSize(STYLE.sizes.normal);
  let yPos = 55;
  companyLines.forEach((line) => {
    if (line) {
      const maxWidth = doc.internal.pageSize.width / 2 - 40;
      const text = doc.splitTextToSize(line, maxWidth);
      doc.text(text, STYLE.margins.page + 5, yPos);
      yPos += lineHeight;
    }
  });

  return boxHeight + 50;
};
const generateClientSection = (doc: jsPDF, client: any, startY: number) => {
  const clientLines = [
    client.name,
    client.address,
    `${client.postalCode} ${client.city}`,
    client.phone ? `Tél : ${client.phone}` : null,
    `Email : ${client.email}`,
  ].filter(Boolean);

  const lineHeight = 7;
  const boxHeight = clientLines.length * lineHeight + 15;

  // Section client
  doc.setFillColor(...STYLE.colors.borders);
  doc.roundedRect(
    doc.internal.pageSize.width / 2 + 10,
    50,
    doc.internal.pageSize.width / 2 - 30,
    boxHeight,
    2,
    2,
    "F"
  );

  // Titre "CLIENT"
  doc.setFont(STYLE.fonts.bold);
  let yPos = 55;
  doc.text("CLIENT", doc.internal.pageSize.width / 2 + 15, yPos);
  yPos += 10;

  // Informations client
  doc.setFont(STYLE.fonts.normal);
  clientLines.forEach((line) => {
    if (line) {
      const maxWidth = doc.internal.pageSize.width / 2 - 40;
      const text = doc.splitTextToSize(line, maxWidth);
      doc.text(text, doc.internal.pageSize.width / 2 + 15, yPos);
      yPos += lineHeight;
    }
  });

  return boxHeight + 50;
};

const generateItemsTable = (doc: jsPDF, items: any[], startY: number) => {
  (doc as any).autoTable({
    startY: startY + 10,
    head: [["Description", "Quantité", "Prix unitaire", "Total"]],
    body: items.map((item) => [
      item.description,
      item.quantity,
      formatCurrency(item.unitPrice),
      formatCurrency(item.total),
    ]),
    styles: {
      fontSize: STYLE.sizes.normal,
      font: STYLE.fonts.normal,
      lineWidth: 0.5,
      lineColor: STYLE.colors.borders,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: STYLE.colors.header,
      font: STYLE.fonts.bold,
      textColor: STYLE.colors.text,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 40, halign: "right" },
    },
    margin: { top: 10 },
  });

  return (doc as any).lastAutoTable.finalY;
};

const generateFooter = (
  doc: jsPDF,
  companyInfo: any,
  total: number,
  tableEndY: number
) => {
  // Total
  doc.setFont(STYLE.fonts.bold);
  doc.setFontSize(STYLE.sizes.subtitle);
  doc.text(
    `Total TTC : ${formatCurrency(total)}`,
    doc.internal.pageSize.width - 30,
    tableEndY + 15,
    { align: "right" }
  );

  // TVA
  doc.setFont(STYLE.fonts.normal, "italic");
  doc.setFontSize(STYLE.sizes.normal);
  doc.text(
    "TVA non applicable, article 293 B du CGI",
    STYLE.margins.page,
    tableEndY + 25
  );

  // Ligne de séparation
  const footerY = doc.internal.pageSize.height - 30;
  doc.setDrawColor(...STYLE.colors.borders);
  doc.line(
    STYLE.margins.page,
    footerY - 10,
    doc.internal.pageSize.width - STYLE.margins.page,
    footerY - 10
  );

  // Footer
  doc.setFont(STYLE.fonts.normal);
  doc.setFontSize(STYLE.sizes.small);

  const footerText = [
    `${companyInfo.name}${
      companyInfo.website ? ` - ${companyInfo.website}` : ""
    }`,
    "Merci pour votre confiance !",
    `Siège social : ${companyInfo.address} - SIREN : ${companyInfo.siret}`,
  ];

  footerText.forEach((line, index) => {
    const textWidth =
      (doc.getStringUnitWidth(line) * STYLE.sizes.small) /
      doc.internal.scaleFactor;
    const xPos = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(line, xPos, footerY + index * 4);
  });
};

export const generateQuotePDF = (quote: Quote, companyInfo: any): jsPDF => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const headerEndY = generateHeader(
    doc,
    "DEVIS",
    {
      number: quote.number,
      date: quote.date,
      validUntil: quote.validUntil,
    },
    companyInfo
  );

  const clientEndY = generateClientSection(doc, quote.client, headerEndY);
  const tableEndY = generateItemsTable(doc, quote.items, clientEndY);
  generateFooter(doc, companyInfo, quote.total, tableEndY);

  return doc;
};

export const generateInvoicePDF = (
  invoice: Invoice,
  companyInfo: any
): jsPDF => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const headerEndY = generateHeader(
    doc,
    "FACTURE",
    {
      number: invoice.number,
      date: invoice.date,
      dueDate: invoice.dueDate,
    },
    companyInfo
  );

  const clientEndY = generateClientSection(doc, invoice.client, headerEndY);
  const tableEndY = generateItemsTable(doc, invoice.items, clientEndY);
  generateFooter(doc, companyInfo, invoice.total, tableEndY);

  return doc;
};
