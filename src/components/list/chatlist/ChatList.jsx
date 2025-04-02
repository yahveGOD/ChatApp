import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser"
import { useUserStore } from "../../../lib/UserStore"
import { client, databases } from "../../../lib/AppWriteConfig"
import { useChatStore } from "../../../lib/ChatStore"

const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([])
  const { currentUser } = useUserStore()
  const { chatId, changeChat} = useChatStore()


  const fetchChats = async () => {
    try {
      const userChats = await databases.getDocument(
        "67e55994002fd6e76a8f",
        "user_chats",
        currentUser.$id
      );
  
      if (!userChats?.chats?.length) {
        setChats([]);
        return;
      }
  
      const chatPromises = userChats.chats.map(async (chatId) => {
        try {
          const chatDoc = await databases.getDocument(
            "67e55994002fd6e76a8f",
            "67e94a480016ebaba40f",
            chatId
          );
          
          if (!chatDoc || !chatDoc.participants.includes(currentUser.$id)) {
            return null;
          }
          
          const receiverId = chatDoc.participants.find(id => id !== currentUser.$id);
          const userDoc = await databases.getDocument(
            "67e55994002fd6e76a8f",
            "users",
            receiverId
          );
          
          return {
            chatId,
            receiverId,
            user: userDoc,
            lastMessage: chatDoc.lastMessage || "No messages yet",
            updatedAt: chatDoc.updatedAt || chatDoc.createdAt
          };
        } catch (error) {
          console.error(`Error loading chat ${chatId}:`, error);
          return null;
        }
      });
  
      const loadedChats = (await Promise.all(chatPromises)).filter(chat => chat !== null);
      setChats(loadedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      if (err.code === 404) {
        console.log("User chats document not found, creating new one");
        try {
          await databases.createDocument(
            "67e55994002fd6e76a8f",
            "user_chats",
            currentUser.$id,
            { chats: [] }
          );
          setChats([]);
        } catch (createErr) {
          console.error("Error creating user_chats:", createErr);
          setChats([]);
        }
      } else {
        console.error("Ошибка загрузки чатов:", err);
        setChats([]);
      }
    }
  };

  useEffect(() => {
    fetchChats()
  }, [currentUser.id])

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.67e55994002fd6e76a8f.collections.user_chats.documents.${currentUser.id}`,
      fetchChats
    )

    return () => unsubscribe()
  }, [currentUser.id])


  const handleSelect = async (chat) => {
    changeChat(chat.chatId,chat.user)
  }

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchbar">
          <img src="public/search.png" alt=""/>
          <input type="text" placeholder="Search"/>
        </div>
        <img 
          className="add" 
          src={addMode ? "./minus.png" : "./add.png"} 
          alt=""
          onClick={() => {setAddMode(prev => !prev)

          }}
        />
      </div>

      {chats.map(chat => (
        <div className="item" key={chat.chatId} onClick={()=> handleSelect(chat)}>
          <img src={chat.user?.avatar || "./avatar.png"} alt=""/>
          <div className="texts">
            <span>{chat.user?.username || "Unknown"}</span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}
      
      {addMode && <AddUser onChatAdded={fetchChats} />}
    </div>
  )
}

export default ChatList