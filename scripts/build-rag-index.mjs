import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'content')
const OUT_FILE = join(ROOT, 'lib/generated/content-index.json')

const MAX_CHUNK_LENGTH = 1200

function stripMdx(text) {
  return text
    .replace(/^---[\s\S]*?---\n?/m, '')          // frontmatter
    .replace(/```[\s\S]*?```/g, '')               // code blocks
    .replace(/^import\s+.*$/gm, '')               // imports
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // JSX components
    .replace(/<[^>]+\/>/g, '')                    // self-closing JSX
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')      // [text](url) → text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')       // images
    .replace(/^[#]+\s*/gm, '')                    // headings marker
    .replace(/[*_`~]/g, '')                       // emphasis
    .replace(/^\|.+\|$/gm, '')                   // table rows
    .replace(/^\s*[-+*]\s+/gm, '')               // list bullets
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) fm[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '')
  }
  return fm
}

function chunkByHeadings(raw, filePath, fm) {
  const title = fm.title || filePath
  const description = fm.description || ''
  const sections = raw.split(/^#{1,3}\s+(.+)$/m)
  const chunks = []

  if (description) {
    chunks.push({ title, section: title, content: description, path: filePath })
  }

  let i = 0
  const parts = raw.split(/(^#{1,3}\s+.+$)/m)
  let currentHeading = title

  for (const part of parts) {
    const headingMatch = part.match(/^#{1,3}\s+(.+)$/)
    if (headingMatch) {
      currentHeading = headingMatch[1].trim()
      continue
    }
    const text = stripMdx(part)
    if (text.length < 40) continue
    chunks.push({
      title,
      section: currentHeading,
      content: text.slice(0, MAX_CHUNK_LENGTH),
      path: filePath,
    })
  }

  if (chunks.length === 0) {
    const stripped = stripMdx(raw)
    if (stripped.length > 40) {
      chunks.push({ title, section: title, content: stripped.slice(0, MAX_CHUNK_LENGTH), path: filePath })
    }
  }

  return chunks
}

function walkDir(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...walkDir(full))
    } else if (/\.(mdx?|md)$/.test(entry) && entry !== 'meta.json') {
      files.push(full)
    }
  }
  return files
}

const files = walkDir(CONTENT_DIR)
const chunks = []

for (const file of files) {
  const raw = readFileSync(file, 'utf-8')
  const fm = extractFrontmatter(raw)
  const rel = '/' + relative(CONTENT_DIR, file).replace(/\\/g, '/')
  chunks.push(...chunkByHeadings(raw, rel, fm))
}

mkdirSync(join(ROOT, 'lib/generated'), { recursive: true })
writeFileSync(OUT_FILE, JSON.stringify(chunks, null, 0))
console.log(`[rag-index] Built ${chunks.length} chunks from ${files.length} files → lib/generated/content-index.json`)
