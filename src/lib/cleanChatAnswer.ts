/** Strip free-model planning / word-count leakage from assistant replies. */
export function cleanChatAnswer(raw: string) {
  let text = raw.replace(/\r\n/g, '\n').trim()
  if (!text) return text

  const markerMatch = text.match(
    /(?:^|\n)(?:Draft:|Final answer:|Final reply:|Reply:|Parent-facing reply:)\s*\n+([\s\S]+)$/i,
  )
  if (markerMatch?.[1]) text = markerMatch[1].trim()

  const stepIndex = text.search(/(?:\*\*)?\d+\.\s+\S/)
  if (
    stepIndex > 0 &&
    /(?:we need to|let'?s craft|the user|instruction|analyze|thinking)/i.test(text.slice(0, stepIndex))
  ) {
    text = text.slice(stepIndex).trim()
  }

  if (/^(?:we need to|let'?s|okay,? the user|the instruction|i need to|here's a thinking)\b/i.test(text)) {
    const firstGood = text.search(/\n\n(?!\s*(?:we need to|let'?s|okay|the instruction|i need to)\b)/i)
    if (firstGood > 0) text = text.slice(firstGood).trim()
  }

  const trailingMeta = text.search(
    /(?:^|\n)\s*(?:Check word count|Word count|Count words|Let's count|Let us count|I'll count|I will count|Count manually|Words:\s*\d|Roughly\b|Now count|Okay,? now |["']Hello\.["']\s*Not needed|Not needed\.|Message\s*$|Let's craft|Let's draft|So we can use)/i,
  )
  if (trailingMeta > 0) text = text.slice(0, trailingMeta).trim()

  const firstOne = text.search(/(?:\*\*)?1\.\s/)
  if (firstOne >= 0) {
    const rest = text.slice(firstOne + 2)
    const secondOne = rest.search(/\n\s*(?:\*\*)?1\.\s/)
    if (secondOne >= 0) {
      text = text.slice(0, firstOne + 2 + secondOne).trim()
    }
  }

  text = text.replace(/(?:\n|^)\s*(?:Words:\s*)?(?:\d+\.\s*)?\(?\s*$/g, '').trim()
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  if (!isUsableParentReply(text)) return FALLBACK_ADMISSIONS_REPLY
  return text
}

const FALLBACK_ADMISSIONS_REPLY = `**1. Enquire** – Call **059 977 2383** or WhatsApp **024 201 9659**, or use the online form at **/admissions**.

**2. Apply & submit documents** – Share your child’s details and bring the birth certificate, two passport photos, and a parent/guardian ID. Transferring learners may also share a recent school report.

**3. Confirm enrolment** – After placement is confirmed, the admissions team will guide you through fees and the final registration steps.`

function looksLikePlanning(text: string) {
  return /(?:let'?s craft|let'?s draft|we need to answer|so we can use|under 140 words|bold step titles|check word count|let'?s count|count words|parent-facing reply|\*\*1\.\s*Title\*\*|here'?s a thinking|words:\s*\d)/i.test(
    text,
  )
}

function isUsableParentReply(text: string) {
  if (text.length < 40) return false
  if (looksLikePlanning(text)) return false
  return true
}
