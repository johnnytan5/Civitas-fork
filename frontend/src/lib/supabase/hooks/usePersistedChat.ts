'use client'

import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { createClient } from '../client'
import { createChatSession } from '../chat'

/**
 * TODO: Re-enable chat persistence after fixing AI SDK v3 message type compatibility
 * The UIMessage type structure has changed and needs investigation
 */
export function usePersistedChat(userAddress: string | undefined) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  // Initialize chat session
  useEffect(() => {
    if (!userAddress) return

    const initSession = async () => {
      setIsLoadingHistory(true)

      try {
        // Create new session
        const session = await createChatSession(userAddress)
        setSessionId(session.id)
      } catch (error) {
        console.error('Failed to initialize chat session:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    initSession()
  }, [userAddress])

  // Custom send message wrapper
  const sendMessage = (content: string) => {
    chat.sendMessage({ text: content })
  }

  return {
    ...chat,
    sendMessage,
    sessionId,
    isLoadingHistory,
  }
}
