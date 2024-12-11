// src/utils/pdf-generator.ts

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Quote, Invoice } from "@/types";
import { formatCurrency } from "./format";

// Types
interface CompanyInfo {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  siret: string;
  website?: string;
  rib?: string;
  iban?: string;
  bic?: string;
  ape?: string;
}

// Constantes
const COLORS = {
  primary: [30, 64, 175], // Bleu royal foncé
  secondary: [249, 250, 251], // Gris très clair
  textDark: [17, 24, 39], // Noir profond
  textLight: [255, 255, 255], // Blanc
  textGrey: [107, 114, 128], // Gris moyen
} as const;

const FONTS = {
  normal: {
    size: {
      title: 24,
      subtitle: 12,
      text: 10,
      small: 8,
    },
  },
} as const;

// Utilitaires
const formatDate = (date: string) =>
  format(new Date(date), "dd/MM/yyyy", { locale: fr });

// Composants du document
const generateHeader = (
  doc: jsPDF,
  docType: "facture" | "devis",
  number: string,
  date: string,
  companyInfo: CompanyInfo
) => {
  // En-tête avec bandeau bleu
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

  // Titre du document
  doc.setTextColor(...COLORS.textLight);
  doc.setFontSize(FONTS.normal.size.title);
  doc.text(docType.toUpperCase(), 20, 28);

  // Zone d'information du document
  doc.setTextColor(...COLORS.textDark);
  doc.setFillColor(...COLORS.secondary);
  doc.rect(doc.internal.pageSize.width - 160, 50, 140, 60, "F");

  doc.setFontSize(FONTS.normal.size.subtitle);
  doc.text(`${docType} n°`, doc.internal.pageSize.width - 150, 70);
  doc.text(number, doc.internal.pageSize.width - 80, 70);
  doc.text("Date", doc.internal.pageSize.width - 150, 85);
  doc.text(formatDate(date), doc.internal.pageSize.width - 80, 85);

  // Informations de l'entreprise
  doc.setFontSize(FONTS.normal.size.text);
  let yPos = 70;

  [
    { label: "Nom", value: companyInfo.name },
    { label: "Adresse", value: companyInfo.address },
    { label: "", value: `${companyInfo.postalCode} ${companyInfo.city}` },
    { label: "Email", value: companyInfo.email },
    { label: "Téléphone", value: companyInfo.phone },
    { label: "SIRET", value: companyInfo.siret },
  ].forEach(({ label, value }) => {
    if (label) doc.text(label, 20, yPos);
    if (value) doc.text(value, 90, yPos);
    yPos += 15;
  });
};

const generateClientInfo = (doc: jsPDF, client: any, yStart: number = 120) => {
  doc.setFontSize(FONTS.normal.size.subtitle);
  doc.text("Client :", 20, yStart);

  doc.setFontSize(FONTS.normal.size.text);
  let yPos = yStart + 15;

  [
    client.name,
    client.address,
    `${client.postalCode} ${client.city}`,
    client.phone && `Tél : ${client.phone}`,
    `Email : ${client.email}`,
  ]
    .filter(Boolean)
    .forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 15;
    });

  return yPos;
};

const generateItemsTable = (doc: jsPDF, items: any[], yStart: number) => {
  (doc as any).autoTable({
    startY: yStart + 10,
    head: [["Description", "Quantité", "Prix unitaire", "Total"]],
    body: items.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.total),
    ]),
    styles: {
      fontSize: FONTS.normal.size.text,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.textLight,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 40, halign: "right" },
    },
    theme: "grid",
  });

  return (doc as any).lastAutoTable.finalY;
};

const generateFooter = (doc: jsPDF, companyInfo: CompanyInfo) => {
  const legalText = "TVA non applicable, article 293 B du CGI";
  const companyDetails = [
    `AutoEntreprise ${companyInfo.name}${
      companyInfo.website ? ` - Site web : ${companyInfo.website}` : ""
    }`,
    "Dispensé d'immatriculation au RCS et au répertoire des métiers",
    `Siège social : ${companyInfo.address} - SIREN : ${companyInfo.siret}${
      companyInfo.ape ? ` - Code APE ${companyInfo.ape}` : ""
    }`,
  ];

  doc.setFontSize(FONTS.normal.size.small);
  doc.setTextColor(...COLORS.textGrey);

  // Position en bas de page
  const pageHeight = doc.internal.pageSize.height;
  let yPos = pageHeight - 30;

  // Mention TVA
  doc.text(legalText, 20, yPos);

  // Coordonnées bancaires si présentes
  if (companyInfo.iban || companyInfo.rib) {
    yPos += 10;
    if (companyInfo.iban) doc.text(`IBAN : ${companyInfo.iban}`, 20, yPos);
    if (companyInfo.bic) doc.text(`BIC : ${companyInfo.bic}`, 120, yPos);
  }

  // Mentions légales centrées
  companyDetails.forEach((text, index) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * FONTS.normal.size.small) /
      doc.internal.scaleFactor;
    const xPos = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, xPos, pageHeight - 15 + index * 4);
  });
};

// Fonctions d'export principales
export const generateQuotePDF = (
  quote: Quote,
  companyInfo: CompanyInfo
): jsPDF => {
  const doc = new jsPDF();

  generateHeader(doc, "devis", quote.number, quote.date, companyInfo);

  // Date de validité
  doc.setFontSize(FONTS.normal.size.text);
  doc.text(`Valable jusqu'au : ${formatDate(quote.validUntil)}`, 20, 160);

  const clientEndY = generateClientInfo(doc, quote.client, 180);
  const tableEndY = generateItemsTable(doc, quote.items, clientEndY);

  // Total
  doc.setFontSize(FONTS.normal.size.subtitle);
  doc.text(`Total TTC : ${formatCurrency(quote.total)}`, 140, tableEndY + 20);

  generateFooter(doc, companyInfo);

  return doc;
};

export const generateInvoicePDF = (
  invoice: Invoice,
  companyInfo: CompanyInfo
): jsPDF => {
  const doc = new jsPDF();

  generateHeader(doc, "facture", invoice.number, invoice.date, companyInfo);

  // Date d'échéance
  doc.setFontSize(FONTS.normal.size.text);
  doc.text(`Date d'échéance : ${formatDate(invoice.dueDate)}`, 20, 160);

  const clientEndY = generateClientInfo(doc, invoice.client, 180);
  const tableEndY = generateItemsTable(doc, invoice.items, clientEndY);

  // Total et mentions légales
  doc.setFontSize(FONTS.normal.size.subtitle);
  doc.text(`Total TTC : ${formatCurrency(invoice.total)}`, 140, tableEndY + 20);

  generateFooter(doc, companyInfo);

  return doc;
};
