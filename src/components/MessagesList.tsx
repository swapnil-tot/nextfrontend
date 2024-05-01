import { useEffect, useRef } from 'react'
import { useMessages } from 'utils/useMessages'

const MessagesList = () => {

    const { messages, isLoadingAnswer } = useMessages()
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef && containerRef.current) {
            const element = containerRef.current;
            element.scroll({
                top: element.scrollHeight,
                left: 0,
                behavior: "smooth"
            })
        }
    }, [messages])

    return (
        <div className="mx-auto max-w-3xl pt-8 h-[800px] overflow-y-auto" ref={containerRef}>
            {messages?.map((message: any, i) => {
                const isUser = message?.role === 'user'
                if (message?.role === 'system') return null
                return (
                    <div
                        id={`message-${i}`}
                        key={`message-${i}`}
                        className={`fade-up mb-4 flex ${isUser ? 'justify-end' : 'justify-start'
                            } ${i === 1 ? 'max-w-md' : ''}`}

                    >
                        {!isUser && (
                            <img
                                src="/images/ai.jpg"
                                className="h-9 w-9 rounded-full"
                                alt="avatar"
                            />
                        )}
                        <div
                            style={{ maxWidth: 'calc(100% - 45px)' }}
                            className={`group relative rounded-lg px-3 py-2 ${isUser
                                    ? 'from-primary-700 to-primary-600 mr-2 bg-gradient-to-br text-white'
                                    : 'ml-2 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                                }`}
                        >
                            {/* Formatting the message */}
                            {message?.content?.split("\n").map((currentTextBlock: string, index: number) => {
                                if (currentTextBlock === "") {
                                    return <p key={message.id + index}>&nbsp;</p>
                                } else {
                                    return <p key={message.id + index}>{currentTextBlock}</p>
                                }
                            })}
                        </div>
                        {isUser && (
                            <img
                                src="/images/profile-image.jpg"
                                className="h-9 w-9 cursor-pointer rounded-full"
                                alt="avatar"
                            />
                        )}
                    </div>
                )
            })}
            {isLoadingAnswer && (
                <div className="mb-4 flex justify-start">
                    <img
                        src="/images/ai.jpg"
                        className="h-9 w-9 rounded-full"
                        alt="avatar"
                    />
                    <div className="loader relative ml-2 flex items-center justify-between space-x-1.5 rounded-full bg-gray-200 p-2.5 px-4 dark:bg-gray-800">
                        <span className="block h-3 w-3 rounded-full"></span>
                        <span className="block h-3 w-3 rounded-full"></span>
                        <span className="block h-3 w-3 rounded-full"></span>
                    </div>
                </div>
            )}
        </div>
    )
}
export default MessagesList