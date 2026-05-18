import MidtransClient from 'midtrans-client'
import crypto from 'crypto'

// Server-only — jangan import di client components
const snap = new MidtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
})

export interface SnapParams {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  itemName: string
  quantity: number
  unitPrice: number
}

export async function createSnapToken(params: SnapParams): Promise<string> {
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    item_details: [{
      id: params.orderId,
      name: params.itemName,
      quantity: params.quantity,
      price: params.unitPrice,
    }],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    },
  } as Parameters<typeof snap.createTransaction>[0])
  return transaction.token
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex')
  return hash === signatureKey
}
