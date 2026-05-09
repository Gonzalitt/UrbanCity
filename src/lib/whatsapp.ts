import { formatCurrency } from '@/lib/formatters'
import type { CheckoutOrderItem } from '@/types/store'

interface BuildMessageInput {
  orderCode: string
  storeName: string
  customerName: string
  customerPhone: string
  customerMessage: string
  checkoutMessage: string | null
  items: CheckoutOrderItem[]
  total: number
}

export function normalizeWhatsAppPhone(phone: string) {
  return phone.replace(/\D/g, '')
}

export function generateOrderCode() {
  const randomBuffer = new Uint32Array(1)
  globalThis.crypto.getRandomValues(randomBuffer)
  const currentDate = new Date()
  const year = String(currentDate.getFullYear()).slice(-2)
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const randomPart = String((randomBuffer.at(0) ?? 0) % 1_000_000).padStart(6, '0')

  return `PED-${year}${month}${day}-${randomPart}`
}

export function buildWhatsAppMessage({
  orderCode,
  storeName,
  customerName,
  customerPhone,
  customerMessage,
  checkoutMessage,
  items,
  total,
}: BuildMessageInput) {
  const lines = [
    `Hola, quiero confirmar un pedido de ${storeName}.`,
    '',
    `Codigo: ${orderCode}`,
    `Cliente: ${customerName}`,
    `Telefono: ${customerPhone}`,
    '',
    'Detalle del pedido:',
    ...items.map(
      (item) =>
        `- ${item.productName} x${item.quantity} | ${formatCurrency(item.subtotal)}`,
    ),
    '',
    `Total del pedido: ${formatCurrency(total)}`,
    'Estado inicial: pendiente de confirmacion',
  ]

  if (customerMessage.trim()) {
    lines.push(`Mensaje del cliente: ${customerMessage.trim()}`)
  }

  if (checkoutMessage?.trim()) {
    lines.push('', checkoutMessage.trim())
  }

  lines.push('', 'El pago se coordina manualmente con el comercio.')

  return lines.join('\n')
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const cleanPhone = normalizeWhatsAppPhone(phone)
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
