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
        currentUser.id
      )

      const chatPromises = userChats.chats.map(async (chatId) => {
        const chatDoc = await databases.getDocument(
          "67e55994002fd6e76a8f",
          "67e94a480016ebaba40f",
          chatId
        )
        
        const receiverId = chatDoc.participants.find(id => id !== currentUser.id)
        const userDoc = await databases.getDocument(
          "67e55994002fd6e76a8f",
          "users",
          receiverId
        )
        
        return {
          chatId,
          receiverId,
          user: userDoc,
          lastMessage: chatDoc.messages?.slice(-1)[0]?.text || "",
          updatedAt: chatDoc.updatedAt || chatDoc.createdAt
        }
      })

      const loadedChats = await Promise.all(chatPromises)
      setChats(loadedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
    } catch (err) {
      console.error("Ошибка загрузки чатов:", err)
    }
  }

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