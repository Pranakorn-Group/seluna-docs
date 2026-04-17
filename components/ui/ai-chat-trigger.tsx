'use client'

import { useAiChat } from './ai-chat-provider'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export function AiChatTrigger() {
  const { setOpen } = useAiChat()
  return (
    <motion.button
      onClick={() => setOpen(true)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white border border-white/[0.08] hover:border-indigo-500/40 hover:bg-indigo-500/8 bg-white/[0.03] transition-all group"
    >
      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-sm group-hover:shadow-indigo-500/30 transition-shadow">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <span>ถาม Seluna AI</span>
    </motion.button>
  )
}
