import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const GOLD = '#C9A84C'

const styles = StyleSheet.create({
  page: { backgroundColor: '#0D0D0D', padding: 40, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  brand: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: GOLD },
  brandSub: { fontSize: 9, color: '#888', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 20 },
  title: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#F5F5F5', marginBottom: 6 },
  badge: { backgroundColor: '#1A1A1A', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 20 },
  badgeText: { fontSize: 10, color: GOLD },
  row: { flexDirection: 'row', gap: 32, marginBottom: 24 },
  col: { flex: 1 },
  label: { fontSize: 9, color: '#666', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 13, color: '#E5E5E5', fontFamily: 'Helvetica-Bold' },
  qrSection: { alignItems: 'center', marginTop: 8 },
  qrBox: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8 },
  qrLabel: { fontSize: 9, color: '#555', marginTop: 8, textAlign: 'center' },
  ticketCode: { fontSize: 11, color: GOLD, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginTop: 4, letterSpacing: 2 },
  footer: { marginTop: 32, borderTopWidth: 1, borderTopColor: '#1A1A1A', paddingTop: 16 },
  footerText: { fontSize: 8, color: '#444', textAlign: 'center' },
})

export interface ETicketData {
  ticketCode: string
  attendeeName: string
  seminarTitle: string
  ticketType: string
  date: string
  venue: string
  city: string
  qrDataUrl: string // base64 PNG dari QR code
}

export function ETicketDocument({ data }: { data: ETicketData }) {
  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TDW Resources</Text>
            <Text style={styles.brandSub}>Official E-Ticket</Text>
          </View>
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <Image src={data.qrDataUrl} style={{ width: 80, height: 80 }} />
            </View>
            <Text style={styles.qrLabel}>Scan untuk verifikasi</Text>
            <Text style={styles.ticketCode}>{data.ticketCode}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Seminar title */}
        <Text style={styles.title}>{data.seminarTitle}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{data.ticketType}</Text>
        </View>

        {/* Details */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Peserta</Text>
            <Text style={styles.value}>{data.attendeeName}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Lokasi</Text>
            <Text style={styles.value}>{data.venue}</Text>
            <Text style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{data.city}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tiket ini adalah bukti sah kehadiran Anda. Harap tunjukkan kepada panitia saat registrasi.
            Tiket tidak dapat dipindahtangankan. © TDW Resources
          </Text>
        </View>
      </Page>
    </Document>
  )
}

