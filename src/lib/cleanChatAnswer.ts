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
    /(?:^|\n)\s*(?:Check word count|Word count|Count words|Let's count|Let us count|I'll count|I will count|Count manually|Words:\s*\d|Roughly\b|Now count|Okay,? now |["']Hello\.["']\s*Not needed|Not needed\.|Message\s*$)/i,
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
  return text.replace(/\n{3,}/g, '\n\n').trim()
}
