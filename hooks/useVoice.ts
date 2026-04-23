'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export type VoiceState = 'idle' | 'listening' | 'processing' | 'error'

interface UseVoiceReturn {
  voiceState: VoiceState
  transcript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// Augment Window to include webkit prefixed API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start: () => void
  stop: () => void
  onstart: ((e: Event) => void) | null
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: { error: string } & Event) => void) | null
  onend: ((e: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export function useVoice(onResult: (text: string) => void): UseVoiceReturn {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  // Start false on both server and client; set to real value after mount
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const voiceStateRef = useRef(voiceState)

  useEffect(() => {
    voiceStateRef.current = voiceState
  }, [voiceState])

  useEffect(() => {
    setIsSupported(
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    )
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVoiceState('idle')
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.')
      setVoiceState('error')
      return
    }

    setError(null)
    setTranscript('')

    const SpeechRec = window.webkitSpeechRecognition ?? window.SpeechRecognition
    if (!SpeechRec) {
      setError('SpeechRecognition not available.')
      setVoiceState('error')
      return
    }

    const recognition = new SpeechRec()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => setVoiceState('listening')

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      setTranscript(final || interim)
      if (final) {
        recognitionRef.current = null
        onResult(final.trim())
        setVoiceState('idle')  // reset immediately — chat loading indicator covers the wait
      }
    }

    recognition.onerror = (event: { error: string } & Event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow mic access in your browser settings.')
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'network') {
        setError('Network error during speech recognition.')
      } else {
        setError('Voice recognition failed. Please try again.')
      }
      setVoiceState('error')
      recognitionRef.current = null
    }

    recognition.onend = () => {
      if (voiceStateRef.current === 'listening') setVoiceState('idle')
    }

    recognitionRef.current = recognition
    recognition.start()

    timeoutRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setError('Listening timed out. Please try again.')
        setVoiceState('error')
      }
    }, 15000)
  }, [isSupported, onResult])

  useEffect(() => () => {
    stopListening()
  }, [stopListening])

  return {
    voiceState,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript(''),
  }
}
