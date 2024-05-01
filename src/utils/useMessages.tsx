import { useToast } from '@apideck/components'
import  ChatCompletionRequestMessage  from 'openai'
import io from 'socket.io-client';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'

interface ChatMessage {
    role: string;
    content: string;
  }

interface ContextProps {
  messages: ChatCompletionRequestMessage[]
  addMessage: (content: string) => Promise<void>
  isLoadingAnswer: boolean
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  let socket:any;

  useEffect(() => {
    const initializeSocket = async () => {
      await fetch('/api/socket');
      socket = io();

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('messages', (message:ChatMessage) => {
        setMessages((prevMessages:any) => [...prevMessages, message]);
     });
    };
  
    initializeSocket();

    return () => {
        socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: any = {
        role: 'system',
        content: 'You are ChatGPT, a large language model trained by OpenAI.'
      }
      const welcomeMessage: any = {
        role: 'assistant',
        content: 'Hi, How can I help you today?'
      }
      setMessages([systemMessage, welcomeMessage])
    }

    // When no messages are present, we initialize the chat the system message and the welcome message
    if (!messages?.length) {
      initializeChat()
    }
  }, [messages?.length, setMessages])

  /**
   * add meesage
   * @param content 
   */
  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: any = {
        role: 'user',
        content
      }
      
      const newMessages = [...messages, newMessage]
      const socket = io();
      socket.emit('messages', newMessages);

      // Add the user message to the state so we can see it immediately
      setMessages(newMessages)
      
      const { data } = await sendMessage(newMessages)
      const reply = data?.choices[0]?.message

      // Add the assistant message to the state
      setMessages([...newMessages, reply])
      
      socket.close();
    } catch (error) {
      // Show error when something goes wrong
      addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}