import { retrieveContext } from '@/lib/rag'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `คุณคือผู้ช่วย AI ของ Seluna Cloud ที่ชื่อว่า "Seluna AI"
หน้าที่: ตอบคำถามเกี่ยวกับการใช้งานระบบ Seluna Cloud โดยอ้างอิงจากเอกสารที่ให้มา
กฎ:
- ตอบเป็นภาษาไทยเสมอ เว้นแต่ผู้ใช้ถามเป็นภาษาอังกฤษ
- ตอบกระชับ ตรงประเด็น ไม่เกิน 3 ย่อหน้า
- ใช้ bullet points เมื่อมีหลายขั้นตอน
- หากไม่มีข้อมูลในเอกสาร ให้บอกว่า "ไม่พบข้อมูลในเอกสาร กรุณาติดต่อทีมสนับสนุน"
- ห้ามคาดเดาหรือแต่งข้อมูลที่ไม่มีในเอกสาร
- ตรวจทานภาษาไทยก่อนตอบเสมอ ห้ามทำสระ วรรณยุกต์ ตัวสะกด หรือช่องว่างหาย

ข้อมูลทีมงาน (ใช้ตอบเมื่อถูกถามว่าใครทำ/ใครพัฒนา/ทีมงานคือใคร):
Document Seluna Cloud พัฒนาโดยทีมงาน [Pranakorn Group](https://pranakorn.in.th) ประกอบด้วย:
- Sirayuth Naensing — ผู้พัฒนาและอัพเดตเนื้อหา | [sirayuth.com](https://sirayuth.com)
- Phattaradit Muanmontree — ผู้พัฒนาระบบอื่นๆ | [phattaradit.dev](https://phattaradit.dev)`

interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const message: string = body?.message?.trim() ?? ''
  const history: HistoryMessage[] = Array.isArray(body?.history) ? body.history : []

  if (!message) {
    return new Response('Missing message', { status: 400 })
  }

  const apiKey = process.env.TYPHOON_API_KEY
  if (!apiKey) {
    return new Response('TYPHOON_API_KEY not configured', { status: 500 })
  }

  // Build enriched RAG query: combine recent user messages for better retrieval
  const recentUserMsgs = history
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content)
  const ragQuery = [...recentUserMsgs, message].join(' ')
  const context = retrieveContext(ragQuery)

  // Build conversation turns for Typhoon (last 6 messages = 3 exchanges)
  const historyTurns = history.slice(-6).map(m => ({
    role: m.role,
    content: m.content,
  }))

  const upstream = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.TYPHOON_MODEL ?? 'typhoon-v2.1-12b-instruct',
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nเอกสารอ้างอิง:\n${context}` },
        ...historyTurns,
        { role: 'user', content: message },
      ],
      stream: true,
      max_tokens: 4096,
      temperature: 0.1,
      top_p: 0.9,
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    console.error('[chat] Typhoon error:', upstream.status, err)
    return new Response('Upstream error', { status: 502 })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    },
  })
}
