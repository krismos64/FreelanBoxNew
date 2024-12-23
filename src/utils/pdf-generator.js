"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = exports.generateQuotePDF = void 0;
const jspdf_1 = require("jspdf");
require("jspdf-autotable");
const date_fns_1 = require("date-fns");
// Fonction utilitaire pour formater la monnaie sans séparateur de milliers
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false, // Désactive les séparateurs de milliers
    }).format(amount);
};
const STYLE = {
    colors: {
        primary: [41, 128, 185], // Bleu professionnel très transparent
        primarySolid: [41, 128, 185], // Bleu professionnel solide
        secondary: [231, 76, 60], // Rouge plus doux
        accent: [245, 245, 245], // Gris très clair
        text: [75, 75, 75],
        textLight: [130, 130, 130],
    },
    fonts: {
        normal: "helvetica",
        bold: "helvetica-bold",
    },
    sizes: {
        title: 18,
        subtitle: 14,
        normal: 10,
        small: 8,
    },
    margins: {
        page: 20,
        section: 15,
    },
};
const generateHeader = (doc, docType, documentInfo, companyInfo) => {
    // Bande bleue en haut plus fine et transparente
    doc.setFillColor(...STYLE.colors.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 36, "F");
    // Titre du document
    doc.setTextColor(...STYLE.colors.accent);
    doc.setFont(STYLE.fonts.bold);
    doc.setFontSize(STYLE.sizes.title);
    doc.text(docType, STYLE.margins.page, 20);
    // Numéro et date
    doc.setFontSize(STYLE.sizes.normal);
    doc.text(`N° ${documentInfo.number}`, doc.internal.pageSize.width - 60, 15);
    doc.text(`Date : ${(0, date_fns_1.format)(new Date(documentInfo.date), "dd/MM/yyyy")}`, doc.internal.pageSize.width - 60, 22);
    if (documentInfo.validUntil) {
        doc.text(`Validité : ${(0, date_fns_1.format)(new Date(documentInfo.validUntil), "dd/MM/yyyy")}`, doc.internal.pageSize.width - 60, 29);
    }
    if (documentInfo.dueDate) {
        doc.text(`Échéance : ${(0, date_fns_1.format)(new Date(documentInfo.dueDate), "dd/MM/yyyy")}`, doc.internal.pageSize.width - 60, 29);
    }
    // Informations de l'entreprise
    doc.setTextColor(...STYLE.colors.text);
    const companyLines = [
        companyInfo.name,
        `Tél : ${companyInfo.phone}`,
        `Email : ${companyInfo.email}`,
    ].filter(Boolean);
    doc.setFont(STYLE.fonts.normal);
    let yPos = 45;
    companyLines.forEach((line) => {
        if (line) {
            doc.text(line, STYLE.margins.page, yPos);
            yPos += 7;
        }
    });
    return yPos + 5;
};
const generateClientSection = (doc, client, startY) => {
    const clientLines = [
        client.name,
        client.address,
        `${client.postalCode} ${client.city}`,
        client.phone ? `Tél : ${client.phone}` : null,
        `Email : ${client.email}`,
    ].filter(Boolean);
    const boxHeight = clientLines.length * 8 + 20;
    doc.setFillColor(...STYLE.colors.accent);
    doc.roundedRect(doc.internal.pageSize.width / 2, startY - 10, doc.internal.pageSize.width / 2 - STYLE.margins.page, boxHeight, 3, 3, "F");
    doc.setFont(STYLE.fonts.bold);
    doc.setTextColor(...STYLE.colors.primarySolid);
    doc.text("CLIENT", doc.internal.pageSize.width / 2 + 10, startY);
    doc.setFont(STYLE.fonts.normal);
    doc.setTextColor(...STYLE.colors.text);
    let yPos = startY + 10;
    clientLines.forEach((line) => {
        if (line) {
            doc.text(line, doc.internal.pageSize.width / 2 + 10, yPos);
            yPos += 7;
        }
    });
    return yPos + 2;
};
const generateItemsTable = (doc, items, startY) => {
    const tableWidth = doc.internal.pageSize.width - 2 * STYLE.margins.page;
    doc.autoTable({
        startY: startY + 10,
        head: [["Description", "Quantité", "Prix unitaire", "Total T.T.C"]],
        body: items.map((item) => [
            item.description,
            item.quantity,
            formatCurrency(item.unitPrice),
            formatCurrency(item.total),
        ]),
        styles: {
            font: STYLE.fonts.normal,
            fontSize: STYLE.sizes.normal,
            lineWidth: 0.1,
            lineColor: STYLE.colors.primarySolid,
            cellPadding: 5,
        },
        headStyles: {
            fillColor: STYLE.colors.primarySolid,
            textColor: "#FFFFFF",
            font: STYLE.fonts.bold,
        },
        columnStyles: {
            0: {
                cellWidth: tableWidth * 0.5,
                overflow: "linebreak",
            },
            1: {
                cellWidth: tableWidth * 0.15,
                halign: "center",
            },
            2: {
                cellWidth: tableWidth * 0.175,
                halign: "right",
            },
            3: {
                cellWidth: tableWidth * 0.175,
                halign: "right",
            },
        },
        margin: { left: STYLE.margins.page, right: STYLE.margins.page },
        tableWidth: tableWidth,
        didParseCell: function (data) {
            // Assure que les nombres sont bien formatés
            if (data.column.index > 1 && data.section === "body") {
                const value = data.cell.raw;
                data.cell.text = [formatCurrency(parseFloat(value))];
            }
        },
    });
    return doc.lastAutoTable.finalY;
};
const generateNotesAndTerms = (doc, notes, terms, startY) => {
    let currentY = startY + 30; // Espace après le tableau
    if (notes) {
        // Section Notes
        doc.setFont(STYLE.fonts.bold);
        doc.setFontSize(STYLE.sizes.normal);
        doc.setTextColor(...STYLE.colors.primarySolid);
        doc.text("Notes", STYLE.margins.page, currentY);
        doc.setFont(STYLE.fonts.normal);
        doc.setTextColor(...STYLE.colors.text);
        const splitNotes = doc.splitTextToSize(notes, doc.internal.pageSize.width - 2 * STYLE.margins.page);
        currentY += 7;
        doc.text(splitNotes, STYLE.margins.page, currentY);
        currentY += splitNotes.length * 7;
    }
    if (terms) {
        // Section Conditions et mentions légales
        currentY += 10; // Espace entre les sections
        doc.setFont(STYLE.fonts.bold);
        doc.setFontSize(STYLE.sizes.normal);
        doc.setTextColor(...STYLE.colors.primarySolid);
        doc.text("Conditions et mentions légales", STYLE.margins.page, currentY);
        doc.setFont(STYLE.fonts.normal);
        doc.setTextColor(...STYLE.colors.text);
        const splitTerms = doc.splitTextToSize(terms, doc.internal.pageSize.width - 2 * STYLE.margins.page);
        currentY += 7;
        doc.text(splitTerms, STYLE.margins.page, currentY);
        currentY += splitTerms.length * 7;
    }
    return currentY;
};
const generateFooter = (doc, companyInfo, total, tableEndY, notes, terms) => {
    let currentY = tableEndY;
    // Total
    doc.setFont(STYLE.fonts.bold);
    doc.setFontSize(STYLE.sizes.subtitle);
    doc.setTextColor(...STYLE.colors.primarySolid);
    doc.text(`Total TTC : ${formatCurrency(total)}`, doc.internal.pageSize.width - 20, currentY + 15, { align: "right" });
    // Si nous avons des notes ou des conditions, les ajouter avant le total
    if (notes || terms) {
        currentY = generateNotesAndTerms(doc, notes, terms, tableEndY);
    }
    // Footer avec fond bleu transparent
    const footerY = doc.internal.pageSize.height - 25;
    doc.setFillColor(...STYLE.colors.primary);
    doc.rect(0, footerY, doc.internal.pageSize.width, 25, "F");
    doc.setFont(STYLE.fonts.normal);
    doc.setFontSize(STYLE.sizes.small);
    doc.setTextColor(...STYLE.colors.accent);
    const footerText = [
        `${companyInfo.name}${companyInfo.website ? ` - ${companyInfo.website}` : ""}`,
        "Merci pour votre confiance !",
        `Siège social : ${companyInfo.address} ${companyInfo.postalCode} ${companyInfo.city} - SIRET : ${companyInfo.siret}`,
    ];
    footerText.forEach((line, index) => {
        const textWidth = (doc.getStringUnitWidth(line) * STYLE.sizes.small) /
            doc.internal.scaleFactor;
        const xPos = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(line, xPos, footerY + 8 + index * 6);
    });
};
const generateQuotePDF = (quote, companyInfo) => {
    const doc = new jspdf_1.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const headerEndY = generateHeader(doc, "DEVIS", {
        number: quote.number,
        date: quote.date,
        validUntil: quote.validUntil,
    }, companyInfo);
    const clientEndY = generateClientSection(doc, quote.client, headerEndY);
    const tableEndY = generateItemsTable(doc, quote.items, clientEndY);
    generateFooter(doc, companyInfo, quote.total, tableEndY, quote.notes, quote.termsAndConditions);
    return doc;
};
exports.generateQuotePDF = generateQuotePDF;
const generateInvoicePDF = (invoice, companyInfo) => {
    const doc = new jspdf_1.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });
    const headerEndY = generateHeader(doc, "FACTURE", {
        number: invoice.number,
        date: invoice.date,
        dueDate: invoice.dueDate,
    }, companyInfo);
    const clientEndY = generateClientSection(doc, invoice.client, headerEndY);
    const tableEndY = generateItemsTable(doc, invoice.items, clientEndY);
    generateFooter(doc, companyInfo, invoice.total, tableEndY, invoice.notes, invoice.termsAndConditions);
    return doc;
};
exports.generateInvoicePDF = generateInvoicePDF;
