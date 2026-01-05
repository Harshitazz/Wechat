import {createContext, useContext, useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const ChatContext= createContext();

const ENDPOINT = process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5004";

const ChatProvider= ({children})=>{
    const [user,setUser]= useState();
    const [selectedChat,setSelectedChat]= useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({}); // { chatId: count }
    const socketRef = useRef(null);

    const navigate=useNavigate();

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo);
        if(!userInfo){
            navigate('/');
        }
    },[navigate])

    // Global socket connection for receiving messages from all chats
    useEffect(() => {
        if (!user?.token) return;

        const socket = io(ENDPOINT, {
            auth: { token: user.token },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("🟢 Global socket connected for message notifications");
            // Join all chat rooms when socket connects (if chats are already loaded)
            if (chats.length > 0) {
                chats.forEach((chat) => {
                    socket.emit("join chat", chat._id);
                });
            }
        });

        // Listen for messages from all chats
        socket.on("message received", (msg) => {
            // Skip call invites
            const isCallInvite =
                typeof msg.content === "string" &&
                msg.content.includes("Video call started");
            
            if (isCallInvite) {
                return;
            }

            // Only increment unread count if this chat is not currently selected
            const chatId = msg.chat?._id || msg.chat;
            const senderId = msg.sender?._id || msg.sender;
            const currentUserId = user?._id;
            
            if (!selectedChat || String(selectedChat._id) !== String(chatId)) {
                // Don't count messages sent by the current user
                if (senderId && String(senderId) !== String(currentUserId)) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [chatId]: (prev[chatId] || 0) + 1,
                    }));
                    
                    // Also add to notifications
                    setNotification((prev) =>
                        prev.find((n) => n._id === msg._id) ? prev : [msg, ...prev]
                    );
                }
            }
        });

        socket.on("connect_error", (error) => {
            console.error("❌ Global socket connection error:", error);
        });

        return () => {
            socket.disconnect();
        };
    }, [user?.token, selectedChat, user?._id]);

    // Join all chat rooms when chats are loaded
    useEffect(() => {
        if (socketRef.current && socketRef.current.connected && chats.length > 0) {
            chats.forEach((chat) => {
                socketRef.current.emit("join chat", chat._id);
            });
        }
    }, [chats]);

    // Function to increment unread count for a chat
    const incrementUnreadCount = (chatId) => {
        setUnreadCounts((prev) => ({
            ...prev,
            [chatId]: (prev[chatId] || 0) + 1,
        }));
    };

    // Function to reset unread count for a chat
    const resetUnreadCount = (chatId) => {
        setUnreadCounts((prev) => {
            const newCounts = { ...prev };
            delete newCounts[chatId];
            return newCounts;
        });
    };

    return (
        <ChatContext.Provider value={{
            user,
            setUser, 
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notification,
            setNotification,
            unreadCounts,
            incrementUnreadCount,
            resetUnreadCount
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState=()=>{
    return useContext(ChatContext);

}
export default ChatProvider;