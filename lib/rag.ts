import contentIndex from './generated/content-index.json'

interface Chunk {
  title: string
  section: string
  content: string
  path: string
}

const chunks = contentIndex as Chunk[]

function tokenize(text: string): string[] {
  const tokens = new Set<string>()
  const lower = text.toLowerCase()

  // Latin/English words
  for (const w of lower.match(/[a-z0-9]+/g) ?? []) {
    if (w.length >= 2) tokens.add(w)
  }

  // Thai: whole segments + n-grams (2–5 chars) for partial matching
  for (const seg of lower.match(/[\u0E00-\u0E7F]+/g) ?? []) {
    if (seg.length >= 2) tokens.add(seg)
    const maxN = Math.min(5, seg.length)
    for (let n = 2; n <= maxN; n++) {
      for (let i = 0; i <= seg.length - n; i++) {
        tokens.add(seg.slice(i, i + n))
      }
    }
  }

  return [...tokens]
}

function score(chunk: Chunk, queryTokens: string[]): number {
  const titleSec = `${chunk.title} ${chunk.section}`.toLowerCase()
  const body = chunk.content.toLowerCase()
  const haystack = `${titleSec} ${body}`
  let s = 0
  for (const token of queryTokens) {
    const inTitle = titleSec.includes(token)
    const inBody = body.includes(token)
    if (!inTitle && !inBody) continue
    // shorter tokens are noisier — weight by length
    const weight = Math.min(token.length, 5)
    s += (inTitle ? 4 : 0) + (inBody ? weight : 0)
  }
  return s
}

export function retrieveContext(query: string, topK = 4): string {
  const tokens = tokenize(query)
  if (tokens.length === 0) return chunks.slice(0, 2).map(fmt).join('\n\n---\n\n')

  const scored = chunks
    .map(c => ({ chunk: c, score: score(c, tokens) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  if (scored.length === 0) return chunks.slice(0, 2).map(fmt).join('\n\n---\n\n')

  return scored.map(x => fmt(x.chunk)).join('\n\n---\n\n')
}

function fmt(c: Chunk): string {
  return `[${c.title} › ${c.section}]\n${c.content}`
}
