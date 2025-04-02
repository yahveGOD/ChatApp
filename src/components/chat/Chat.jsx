import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { client, databases, storage } from "../../lib/AppWriteConfig";
import { useChatStore } from "../../lib/ChatStore";
import { useUserStore } from "../../lib/UserStore";
import { ID, Query } from "appwrite";

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [messages, setMessages] = useState([]);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const endRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    const loadChat = async () => {
      const chatData = await databases.getDocument("67e55994002fd6e76a8f", "67e94a480016ebaba40f", chatId);
      setChat(chatData);
      
      if (chatData.message) {
        const messageData = await databases.getDocument("67e55994002fd6e76a8f", "67eceb90003babafbd02", chatData.message);
        setMessages([messageData]);
      }
    };

    loadChat();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const response = await databases.listDocuments(
        "67e55994002fd6e76a8f", "67eceb90003babafbd02",
        [Query.equal("chatId", chatId), Query.orderAsc("createdAt")]
      );
      setMessages(response.documents);
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {

      const newMessage = await databases.createDocument(
        "67e55994002fd6e76a8f", "67eceb90003babafbd02", ID.unique(),
        {
          senderId: currentUser.$id,
          chatId,
          text,
          createdAt: new Date().toISOString(),
        }
      );

      const chatDoc = await databases.getDocument(
        "67e55994002fd6e76a8f", "67e94a480016ebaba40f", chatId
      );
      
      const updatedMessages = chatDoc.message ? [...chatDoc.message, newMessage.$id] : [newMessage.$id];
      
      await databases.updateDocument(
        "67e55994002fd6e76a8f", "67e94a480016ebaba40f", chatId,
        { message: updatedMessages,
          lastMessage: text
         }
      );
      setMessages(prev => [...prev, newMessage]);
      setText("");
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
    }
  };


  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt =""/>
          <div className="texts">
            <span>{user?.username}</span>
          </div>
        </div>
      </div>
      <div className="center">
        {messages.map((message) => (
          <div className={`message ${message.senderId === currentUser.$id ? "own" : ""}`} key={message.$id}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message?.text}</p>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
      <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;