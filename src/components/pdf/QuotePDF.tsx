import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Quote } from '@/types';
import { formatCurrency } from '@/utils/format';

Font.register({
  family: 'SF Pro Display',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'SF Pro Display',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  companyInfo: {
    marginBottom: 20,
  },
  clientInfo: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
  },
});

interface QuotePDFProps {
  quote: Quote;
  companyInfo: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
    siret: string;
  };
}

export const QuotePDF: React.FC<QuotePDFProps> = ({ quote, companyInfo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Devis {quote.number}</Text>
        <Text>Date : {format(new Date(quote.date), 'PP', { locale: fr })}</Text>
        <Text>Valable jusqu'au : {format(new Date(quote.validUntil), 'PP', { locale: fr })}</Text>
      </View>

      {/* Company Info */}
      <View style={styles.companyInfo}>
        <Text>{companyInfo.name}</Text>
        <Text>{companyInfo.address}</Text>
        <Text>{companyInfo.postalCode} {companyInfo.city}</Text>
        <Text>Tél : {companyInfo.phone}</Text>
        <Text>Email : {companyInfo.email}</Text>
        <Text>SIRET : {companyInfo.siret}</Text>
      </View>

      {/* Client Info */}
      <View style={styles.clientInfo}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Client :</Text>
        <Text>{quote.client.name}</Text>
        {quote.client.company && <Text>{quote.client.company}</Text>}
        {quote.client.address && <Text>{quote.client.address}</Text>}
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
          <Text style={styles.tableCell}>Quantité</Text>
          <Text style={styles.tableCell}>Prix unitaire</Text>
          <Text style={styles.tableCell}>Total</Text>
        </View>
        {quote.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={styles.tableCell}>{formatCurrency(item.total)}</Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.total}>
        <Text>Total TTC : {formatCurrency(quote.total)}</Text>
      </View>

      {/* Notes */}
      {quote.notes && (
        <View style={styles.section}>
          <Text style={{ marginBottom: 5 }}>Notes :</Text>
          <Text>{quote.notes}</Text>
        </View>
      )}

      {/* Terms and Conditions */}
      {quote.termsAndConditions && (
        <View style={styles.section}>
          <Text style={{ marginBottom: 5 }}>Conditions :</Text>
          <Text>{quote.termsAndConditions}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>TVA non applicable, article 293 B du CGI</Text>
      </View>
    </Page>
  </Document>
);