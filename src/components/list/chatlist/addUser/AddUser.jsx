import { useState } from "react"
import { databases } from "../../../../lib/AppWriteConfig"
import "./addUser.css"
import { ID, Query } from "appwrite"
import { useUserStore } from "../../../../lib/UserStore"

const AddUser = ({ onChatAdded }) => {
  const [user, setUser] = useState(null)
  const { currentUser } = useUserStore()

  const handleAdd = async () => {
    if (!user) return

    try {
      // 1. Создаем новый чат
      const newChat = await databases.createDocument(
        "67e55994002fd6e76a8f",  
        '67e94a480016ebaba40f',
        ID.unique(),
        {
          createdAt: new Date().toISOString(),
          message: [],
          participants: [user.id, currentUser.id],
          updatedAt: new Date().toISOString()
        }
      )
      // 2. Функция для создания/обновления чатов пользователя
      const updateUserChats = async (userId) => {
        try {
          // Пытаемся получить документ
          const userData = await databases.getDocument(
            "67e55994002fd6e76a8f",
            'user_chats',
            userId
          )
          
          // Если документ существует - обновляем
          await databases.updateDocument(
            "67e55994002fd6e76a8f",
            'user_chats',
            userId,
            {
              chats: [...(userData.chats || []), newChat.$id]
            }
          )
        } catch (error) {
          // Если документ не найден - создаем новый
          if (error.code === 404) {
            await databases.createDocument(
              "67e55994002fd6e76a8f",
              'user_chats',
              userId, // Используем userId как ID документа
              {
                chats: [newChat.$id],
                userId: userId // Дополнительное поле для удобства
              }
            )
          } else {
            console.error(`Error updating chats for user ${userId}:`, error)
          }
        }
      }

      // 3. Обновляем чаты обоих пользователей
      await Promise.all([
        updateUserChats(user.id),
        updateUserChats(currentUser.id)
      ])

      // 4. Вызываем колбэк для обновления списка чатов
      if (onChatAdded) {
        onChatAdded()
      }

      // 5. Сбрасываем состояние
      setUser(null)

    } catch (err) {
      console.error("Ошибка при создании чата:", err)
    }
  }

  // Остальной код остается без изменений
  const handleSearch = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      const response = await databases.listDocuments(
        "67e55994002fd6e76a8f",  
        "users",
        [Query.equal("username", username)]
      )
      
      if (response.documents.length > 0) {
        setUser(response.documents[0])
      } else {
        console.log("Пользователь не найден")
        setUser(null)
      }
    } catch (err) {
      console.error("Ошибка при запросе:", err)
      setUser(null)
    }
  }

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Username" 
          name="username" 
          required
        />
        <button type="submit">Search</button>
      </form>
      
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt=""/>
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  )
}

export default AddUser