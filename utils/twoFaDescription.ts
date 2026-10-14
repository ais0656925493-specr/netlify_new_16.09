import { maskEmail, maskPhoneNumber } from '@/utils/mask'

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Danh sách đích nhận mã 2FA đã mask — bỏ trùng email và số điện thoại */
export function buildTwoFaDestinationParts(
  email: string,
  phone: string,
  emailBusiness?: string,
  phoneBackup?: string
): string[] {
  const parts: string[] = []
  const contact = email.trim()
  const business = (emailBusiness ?? '').trim()
  const contactLower = contact.toLowerCase()
  const businessLower = business.toLowerCase()

  if (contact) {
    parts.push(maskEmail(contact))
  }
  if (business && businessLower !== contactLower) {
    parts.push(maskEmail(business))
  }
  const primaryPhone = phoneDigits(phone)
  const backupPhone = phoneDigits(phoneBackup ?? '')
  if (primaryPhone) {
    parts.push(maskPhoneNumber(primaryPhone))
  }
  if (backupPhone && backupPhone !== primaryPhone) {
    parts.push(maskPhoneNumber(backupPhone))
  }

  return parts
}

/** Định dạng danh sách: a, b, or c */
export function formatDestinationsList(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]}`
}

export function buildTwoFaDestinationsLabel(
  email: string,
  phone: string,
  emailBusiness?: string,
  phoneBackup?: string
): string {
  return formatDestinationsList(
    buildTwoFaDestinationParts(email, phone, emailBusiness, phoneBackup)
  )
}
