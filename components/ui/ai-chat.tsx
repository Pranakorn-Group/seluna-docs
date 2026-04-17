'use client'

import { useAiChat } from './ai-chat-provider'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

export default function AiChatFab() {
  const { open, setOpen } = useAiChat()
  return (
    <motion.button
      onClick={() => setOpen(!open)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      aria-label="เปิด Seluna AI"
      className="fixed bottom-5 right-5 z-40 md:hidden w-13 h-13 rounded-full flex items-center justify-center text-white"
      style={{
        background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
        boxShadow: '0 8px 28px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.4)',
        width: '52px',
        height: '52px',
      }}
    >
      <Sparkles className="w-5 h-5" />
      {!open && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(99,102,241,0.4)' }}
          animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
}
