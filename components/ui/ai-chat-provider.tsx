'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import Image from 'next/image'

// ─── Context ─────────────────────────────────────────────────────────────────

interface AiChatCtx {
  open: boolean
  setOpen: (v: boolean) => void
}

const Ctx = createContext<AiChatCtx>({ open: false, setOpen: () => {} })
export const useAiChat = () => useContext(Ctx)

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-white/10 font-mono text-[0.8em] text-indigo-300">
          {part.slice(1, -1)}
        </code>
      )
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    const h3 = line.match(/^### (.+)/)
    const h2 = line.match(/^## (.+)/)
    const h1 = line.match(/^# (.+)/)
    if (h1) { elements.push(<h1 key={i} className="text-base font-bold text-white mt-2 mb-1">{renderInline(h1[1])}</h1>); i++; continue }
    if (h2) { elements.push(<h2 key={i} className="text-sm font-semibold text-white mt-2 mb-1">{renderInline(h2[1])}</h2>); i++; continue }
    if (h3) { elements.push(<h3 key={i} className="text-sm font-medium text-neutral-200 mt-1.5 mb-0.5">{renderInline(h3[1])}</h3>); i++; continue }

    if (line.match(/^[-*] /)) {
      const items: ReactNode[] = []
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(<li key={i} className="ml-3 list-disc list-outside marker:text-indigo-400">{renderInline(lines[i].slice(2))}</li>)
        i++
      }
      elements.push(<ul key={`ul${i}`} className="space-y-0.5 my-1">{items}</ul>)
      continue
    }

    if (line.match(/^\d+\. /)) {
      const items: ReactNode[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(<li key={i} className="ml-3 list-decimal list-outside marker:text-indigo-400">{renderInline(lines[i].replace(/^\d+\. /, ''))}</li>)
        i++
      }
      elements.push(<ol key={`ol${i}`} className="space-y-0.5 my-1">{items}</ol>)
      continue
    }

    if (line.trim() === '') { i++; continue }

    elements.push(<p key={i} className="leading-relaxed">{renderInline(line)}</p>)
    i++
  }

  return <div className="space-y-1 text-sm text-neutral-200">{elements}</div>
}

// ─── Types & constants ────────────────────────────────────────────────────────

const MAX_CHARS = 324

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const SUGGESTIONS = [
  'วิธีสร้างร้านค้าใหม่',
  'การตั้งค่าการชำระเงิน',
  'ระบบ Wallet คืออะไร',
  'จัดการสินค้าอย่างไร',
  'ดูออเดอร์ในระบบ',
  'ตั้งค่าการจัดส่ง',
]

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 h-4 ml-0.5 align-middle">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: d, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mb-0.5">
          {/* <Bot className="w-3 h-3 text-white" /> */}
                  <Image src="/android-chrome-512x512.png" alt="Seluna Logo" className="h-4 w-4" width={16} height={16} />

        </div>
      )}
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-indigo-600 text-sm text-white rounded-br-sm leading-relaxed'
            : 'bg-white/[0.06] border border-white/[0.08] rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</span>
        ) : msg.content === '' && msg.streaming ? (
          <TypingDots />
        ) : (
          <>
            <MarkdownContent text={msg.content} />
            {msg.streaming && msg.content !== '' && (
              <motion.span
                className="inline-block w-0.5 h-[13px] bg-indigo-400 ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.45, repeat: Infinity }}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

function AiChatDialog() {
  const { open, setOpen } = useAiChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const charCount = input.length
  const overLimit = charCount > MAX_CHARS
  const hasMessages = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  function resize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  async function send(text: string) {
    text = text.trim()
    if (!text || loading || overLimit) return

    // snapshot history before adding new message (exclude streaming placeholders)
    const history = messages
      .filter(m => !m.streaming && m.content)
      .map(({ role, content }) => ({ role, content }))

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    if (inputRef.current) { inputRef.current.style.height = 'auto' }
    setLoading(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      if (!res.ok || !res.body) throw new Error()

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let acc = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue
          try {
            acc += JSON.parse(raw)?.choices?.[0]?.delta?.content ?? ''
            setMessages(prev => {
              const c = [...prev]
              c[c.length - 1] = { role: 'assistant', content: acc, streaming: true }
              return c
            })
          } catch {}
        }
      }
      setMessages(prev => {
        const c = [...prev]
        c[c.length - 1] = { role: 'assistant', content: acc, streaming: false }
        return c
      })
    } catch {
      setMessages(prev => {
        const c = [...prev]
        c[c.length - 1] = { role: 'assistant', content: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', streaming: false }
        return c
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[580px] max-h-[90dvh] h-[640px] flex flex-col rounded-2xl overflow-hidden outline-none"
            style={{
              background: 'rgba(9,9,11,0.98)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)',
            }}
          >
            {/* Top glow line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.07] flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ">
                  {/* <Sparkles className="w-4 h-4 text-white" /> */}
                  <Image src="/android-chrome-512x512.png" alt="Seluna Logo" className="h-4 w-4" width={16} height={16} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#09090b]" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-sm font-semibold text-white leading-none">
                  Seluna AI
                </Dialog.Title>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-none">ค้นหาคำตอบจากเอกสาร Seluna Cloud</p>
              </div>
              {hasMessages && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  ล้างประวัติ
                </button>
              )}
              <Dialog.Close asChild>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {!hasMessages ? (
                  /* Welcome screen */
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center h-full px-6 pb-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 ">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white mb-1">สวัสดี! ฉันคือ Seluna AI</h2>
                    <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                      ถามฉันได้เลยเกี่ยวกับการใช้งาน Seluna Cloud — ฉันจะตอบจากเอกสารโดยตรง
                    </p>
                    <p className="text-xs text-neutral-600 mb-3">ตัวอย่างคำถาม</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                      {SUGGESTIONS.map(s => (
                        <motion.button
                          key={s}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => send(s)}
                          className="text-sm px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  /* Messages */
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 py-4 space-y-4"
                  >
                    {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
                    <div ref={bottomRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-white/[0.07]">
              <div
                className={`flex items-end gap-2 rounded-xl px-4 py-2.5 border transition-colors bg-white/[0.04] ${
                  overLimit ? 'border-red-500/50' : 'border-white/[0.08] focus-within:border-indigo-500/40'
                }`}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); resize(e.target) }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
                  }}
                  placeholder="ถามเกี่ยวกับเอกสาร Seluna..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 resize-none outline-none leading-5 py-0.5 max-h-24 disabled:opacity-50"
                  style={{ minHeight: '20px' }}
                />
                <motion.button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading || overLimit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <p className="text-[10px] text-neutral-700">
                  Powered by <span className="text-neutral-500">Typhoon AI</span>
                  {' · '}RAG
                </p>
                {input && (
                  <p className={`text-[10px] tabular-nums ${overLimit ? 'text-red-400' : 'text-neutral-600'}`}>
                    {charCount}/{MAX_CHARS}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <AnimatePresence>
        {open && <AiChatDialog key="dialog" />}
      </AnimatePresence>
    </Ctx.Provider>
  )
}
