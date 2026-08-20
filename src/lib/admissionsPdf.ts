import { jsPDF } from 'jspdf'
import { school } from './school'

export type AdmissionsPdfRequirement = {
  title: string
  description?: string | null
  is_required?: boolean
}

export type AdmissionsPdfFee = {
  name: string
  default_amount: number
}

export type AdmissionsPdfFields = {
  childName?: string
  dateOfBirth?: string
  gender?: string
  programme?: string
  classLevel?: string
  guardianName?: string
  guardianPhone?: string
  guardianEmail?: string
  relationship?: string
  previousSchool?: string
  howHeard?: string
  message?: string
}

type BuildOptions = {
  requirements: AdmissionsPdfRequirement[]
  fees?: AdmissionsPdfFee[]
  fields?: AdmissionsPdfFields
}

function lineValue(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : '________________________________'
}

function drawField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(12, 27, 53)
  doc.text(label, x, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(40, 48, 60)
  doc.text(value, x, y + 5, { maxWidth: width })
  return y + 14
}

export function downloadAdmissionsFormPdf({ requirements, fees = [], fields = {} }: BuildOptions) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageWidth - margin * 2
  let y = 18

  const ensureSpace = (needed: number) => {
    if (y + needed <= pageHeight - 18) return
    doc.addPage()
    y = 18
  }

  // Header
  doc.setFillColor(12, 27, 53)
  doc.rect(0, 0, pageWidth, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(school.name, margin, 12)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Student Admissions Application Form', margin, 19)
  doc.setFontSize(8)
  doc.text(school.motto, margin, 24)

  y = 38
  doc.setTextColor(90, 101, 117)
  doc.setFontSize(9)
  doc.text(
    `${school.location}  ·  Tel ${school.phoneDisplay}  ·  ${school.website}`,
    margin,
    y,
  )
  y += 8

  doc.setDrawColor(252, 104, 0)
  doc.setLineWidth(0.6)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  doc.setTextColor(12, 27, 53)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Child details', margin, y)
  y += 8

  const half = (contentWidth - 8) / 2
  let leftY = y
  let rightY = y
  leftY = drawField(doc, 'Full name', lineValue(fields.childName), margin, leftY, half)
  rightY = drawField(doc, 'Date of birth', lineValue(fields.dateOfBirth), margin + half + 8, rightY, half)
  leftY = drawField(doc, 'Gender', lineValue(fields.gender), margin, leftY, half)
  rightY = drawField(doc, 'Programme', lineValue(fields.programme), margin + half + 8, rightY, half)
  leftY = drawField(doc, 'Preferred class level', lineValue(fields.classLevel), margin, leftY, half)
  rightY = drawField(doc, 'Previous school', lineValue(fields.previousSchool), margin + half + 8, rightY, half)
  y = Math.max(leftY, rightY) + 2

  ensureSpace(40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(12, 27, 53)
  doc.text('Parent / guardian details', margin, y)
  y += 8

  leftY = y
  rightY = y
  leftY = drawField(doc, 'Full name', lineValue(fields.guardianName), margin, leftY, half)
  rightY = drawField(doc, 'Relationship', lineValue(fields.relationship), margin + half + 8, rightY, half)
  leftY = drawField(doc, 'Phone', lineValue(fields.guardianPhone), margin, leftY, half)
  rightY = drawField(doc, 'Email', lineValue(fields.guardianEmail), margin + half + 8, rightY, half)
  y = Math.max(leftY, rightY)
  y = drawField(doc, 'How did you hear about us?', lineValue(fields.howHeard), margin, y, contentWidth)

  ensureSpace(28)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Message / notes', margin, y)
  y += 4
  doc.setDrawColor(233, 227, 219)
  doc.setLineWidth(0.3)
  const noteHeight = 22
  doc.rect(margin, y, contentWidth, noteHeight)
  if (fields.message?.trim()) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(40, 48, 60)
    doc.text(fields.message.trim(), margin + 3, y + 6, { maxWidth: contentWidth - 6 })
  }
  y += noteHeight + 10

  ensureSpace(24)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(12, 27, 53)
  doc.text('Enrolment requirements', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(90, 101, 117)
  doc.text('Please bring or submit the items below when completing enrolment.', margin, y)
  y += 7

  requirements.forEach((req, index) => {
    const title = `${index + 1}. ${req.title}${req.is_required === false ? '' : ' (Required)'}`
    const description = req.description?.trim() || ''
    const titleLines = doc.splitTextToSize(title, contentWidth - 10)
    const descLines = description ? doc.splitTextToSize(description, contentWidth - 10) : []
    const blockHeight = 6 + titleLines.length * 4 + descLines.length * 3.5 + 4
    ensureSpace(blockHeight)

    doc.setDrawColor(233, 227, 219)
    doc.rect(margin, y, 4, 4)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(12, 27, 53)
    doc.text(titleLines, margin + 8, y + 3.2)
    y += 3.2 + titleLines.length * 4
    if (descLines.length) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(90, 101, 117)
      doc.text(descLines, margin + 8, y)
      y += descLines.length * 3.5
    }
    y += 4
  })

  if (fees.length > 0) {
    ensureSpace(18 + fees.length * 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(12, 27, 53)
    doc.text('Fees due at enrolment', margin, y)
    y += 7
    fees.forEach((fee) => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(40, 48, 60)
      doc.text(fee.name, margin, y)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(252, 104, 0)
      doc.text(`GHS ${Number(fee.default_amount).toLocaleString()}`, pageWidth - margin, y, {
        align: 'right',
      })
      y += 6
    })
    y += 4
  }

  ensureSpace(36)
  doc.setDrawColor(252, 104, 0)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(12, 27, 53)
  doc.text('Declaration', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(90, 101, 117)
  const declaration = doc.splitTextToSize(
    'I confirm that the information provided is accurate and that I have reviewed the enrolment requirements. I understand the school will contact me to confirm documents, fees, and placement.',
    contentWidth,
  )
  doc.text(declaration, margin, y)
  y += declaration.length * 3.8 + 10

  leftY = y
  rightY = y
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(12, 27, 53)
  doc.text('Guardian signature', margin, leftY)
  doc.text('Date', margin + half + 8, rightY)
  doc.setDrawColor(180, 180, 180)
  doc.line(margin, leftY + 10, margin + half - 4, leftY + 10)
  doc.line(margin + half + 8, rightY + 10, pageWidth - margin, rightY + 10)

  const stamp = `Generated ${new Date().toLocaleDateString('en-GB')} · ${school.shortName}`
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(140, 140, 140)
  doc.text(stamp, margin, pageHeight - 8)

  const safeName = (fields.childName || 'application').trim().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-')
  doc.save(`Victoria-Crest-Admissions-Form-${safeName || 'application'}.pdf`)
}
