import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import aiChatService from "../services/aiChatService";

//assests
import newChatIcon from '../assets/new-chat.svg'
import historyIcon from '../assets/history.svg'
import aiIcon from '../assets/chatbot.svg'
import sendIcon from '../assets/sent.svg'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaHistory } from "react-icons/fa";
import Swal from 'sweetalert2'

//helper
import { renderMarkdown } from "../helper/render-markdown";

export const AiChatPage = () => {
    const [sessions, setSessions] = useState([]);
    const [sessionId, setSessionId] = useState(null);

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const chatEndRef = useRef(null);

    // open dropdown
    const [openId, setOpenId] = useState(null)
    const menuRef = useRef(null);

    // Subscribe to AI Chat Service streams
    useEffect(() => {
        console.log('[COMPONENT] AiChatPage mounted - Subscribing to reactive streams...');
        
        // Subscribe to sessions
        const sessionsSubscription = aiChatService.aiSessions$.subscribe(data => {
            console.log('[COMPONENT] Sessions stream updated');
            setSessions(data);
        });

        // Subscribe to selected session
        const selectedSessionSubscription = aiChatService.selectedSession$.subscribe(data => {
            if(data) {
                console.log('[COMPONENT] Selected session updated');
                setSessionId(data.id);
            } else {
                setSessionId(null);
            }
        });

        // Subscribe to chat messages
        const messagesSubscription = aiChatService.chatMessages$.subscribe(data => {
            console.log('[COMPONENT] Chat messages stream updated -', data.length, 'messages');
            setMessages(data);
        });

        // Subscribe to loading state
        const loadingSubscription = aiChatService.isLoading$.subscribe(data => {
            console.log('[COMPONENT] Loading state changed:', data);
            setLoading(data);
        });

        // Subscribe to sending state
        const sendingSubscription = aiChatService.isSending$.subscribe(data => {
            console.log('[COMPONENT] Sending state changed:', data);
            setIsSending(data);
        });

        // Fetch initial sessions
        aiChatService.fetchAiSessions();

        // Cleanup subscriptions
        return () => {
            console.log('[COMPONENT] AiChatPage unmounted - Unsubscribing from streams');
            sessionsSubscription.unsubscribe();
            selectedSessionSubscription.unsubscribe();
            messagesSubscription.unsubscribe();
            loadingSubscription.unsubscribe();
            sendingSubscription.unsubscribe();
        };
    }, []);

    // auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    // load selected chat with reactive service
    const handleSelectSession = async (id) => {
        console.log('[COMPONENT] Session selected:', id);
        aiChatService.selectSession({ id });
    };

    // new chat
    const handleNewChat = () => {
        console.log('[COMPONENT] New chat initiated');
        aiChatService.clearSession();
    };

    // send message with reactive service
    const handleSendMessage = async () => {

        if (!input.trim()) return;

        const currentInput = input;
        setInput("");

        console.log('[COMPONENT] Sending message...');
        
        try {
            await aiChatService.sendAiChat({
                session_id: sessionId,
                message: currentInput
            });

            // session baru otomatis dibuat
            if (!sessionId) {
                console.log('[COMPONENT] New session created from message');
                const newSessionId = aiChatService.sessionDetail$.getValue()?.id;
                if(newSessionId) {
                    setSessionId(newSessionId);
                }
                // Refresh sessions list
                aiChatService.fetchAiSessions();
            }

        } catch (error) {
            console.error('[COMPONENT] Error sending message:', error.message);
        }
    };

    //handle delete with reactive service
    const handleSessionDelete = async (id) => {
        try {
            console.log('[COMPONENT] Deleting session:', id);
            await aiChatService.deleteAiSession(id);
            
            Swal.fire({
                title: 'Berhasil',
                text: 'Chat session deleted successfully',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            
            // Service automatically removes from stream
            setSessionId(null);
        } catch (error) {
            console.error('[COMPONENT] Error deleting session:', error.message);
            Swal.fire({
                title: 'Gagal',
                text: 'Failed to delete chat session',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section className="flex flex-row gap-4 p-6 overflow-x-hidden min-h-[90vh]">
            {/* history */}
            <div className=" min-w-[50vh] flex flex-col gap-6 text-white">
                <div className='flex justify-between items-center'>
                    <h3 className="text-2xl">AI Consultant Chat</h3>
                    <FaHistory className="w-5 h-5"/>
                </div>
                {/* history panel */}
                <div className="flex flex-col gap-2 bg-[#262525] min-h-[75vh] rounded-3xl p-4">
                    <p className="font-medium">History</p>
                    {/* history list */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                        {sessions.length === 0 && (
                            <p className="text-sm text-gray-400">
                                No Chat History
                            </p>
                        )}
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`
                                    relative
                                    pr-4
                                    flex flex-row
                                    justify-between
                                    rounded-xl
                                    ${sessionId === session.id
                                        ? 'bg-white text-black'
                                        : 'bg-[#333]'
                                    }
                                `}>
                                <button
                                    onClick={() => handleSelectSession(session.id)}
                                    className="text-left p-3 rounded-xl transition-all cursor-pointer">
                                    <p className="truncate">
                                        {session.title}
                                    </p>
                                </button>

                                {/* dropdown trigger */}
                                <button
                                    onClick={() =>
                                        setOpenId(openId === session.id ? null : session.id)
                                    }
                                    className="cursor-pointer px-2"
                                >
                                    ⋮
                                </button>

                                {/* popup */}
                                {openId===session.id && (
                                    <div className="
                                        absolute
                                        right-2
                                        top-12
                                        w-40
                                        bg-white
                                        border
                                        rounded-xl
                                        shadow-lg
                                        z-50
                                    ">
                                        <button
                                            className="w-full text-left px-4 py-2 text-black cursor-pointer"
                                            onClick={() => alert("Rename")}
                                        >
                                            Rename
                                        </button>

                                        <button
                                            className="w-full text-left px-4 py-2 text-red-500 cursor-pointer"
                                            onClick={() => handleSessionDelete(session.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleNewChat}
                        className="cursor-pointer flex justify-center gap-6 items-center bg-transparent outline-1 outline-white rounded-3xl px-4 py-2">
                        <img src={newChatIcon} alt="new chat" className="w-4 h-4"/>
                        New Chat
                    </button>
                </div>
            </div>
            {/* chat */}
            <div className="flex-1 rounded-3xl bg-[#262525] flex flex-col h-[83vh]">

                {/* messages */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scroll">

                    {!sessionId && messages.length === 0 && !isSending && (
                        <div className="text-white text-2xl h-full flex flex-col items-center justify-center ">
                            <DotLottieReact
                            src="https://lottie.host/54561d77-10aa-4060-b409-05c3c9b97810/p8w2ZNvIOv.lottie"
                            loop
                            autoplay
                            />
                            <strong>Which business topic shall we tackle today?</strong>
                        </div>
                    )}

                    {messages && messages.map((message, index) => {
                        // Validate message exists and has required properties
                        if (!message || !message.sender) {
                            console.warn('[COMPONENT] Invalid message object:', message);
                            return null;
                        }
                        return (
                            <div
                                key={index}
                                className={`max-w-[70%] px-4 py-3 rounded-2xl break-words text-white
                                    ${message.sender === 'user'
                                        ? 'bg-[#333333] self-end'
                                        : 'bg-transparent self-start'
                                    }`}
                            >
                                {renderMarkdown(message.message)}
                            </div>
                        )
                    })}

                    {isSending && (
                        <div className="bg-[#3b3b3b] self-start px-4 py-3 rounded-2xl text-white">
                            AI Thinking...
                        </div>
                    )}

                    <div ref={chatEndRef}></div>
                </div>

                {/* input */}
                <div className="p-4 border-t border-gray-700 flex gap-3">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        className="outline-1 outline-white flex-1 bg-transparent rounded-2xl px-4 py-3 text-white"
                    />

                    <button
                        onClick={handleSendMessage}
                        className="bg-transparent outline-1 outline-white text-black p-2 rounded-2xl cursor-pointer"
                    >
                        <img src={sendIcon} alt="sent icon"/>
                    </button>
                </div>
            </div>
        </section>
    )
}