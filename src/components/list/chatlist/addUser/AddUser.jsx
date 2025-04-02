import { useState } from "react";
import { databases } from "../../../../lib/AppWriteConfig";
import "./addUser.css";
import { ID, Query } from "appwrite";
import { useUserStore } from "../../../../lib/UserStore";

const AddUser = ({ onChatAdded }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleAdd = async () => {
    if (!user) return;

    try {
      const newChat = await databases.createDocument(
        "67e55994002fd6e76a8f",
        "67e94a480016ebaba40f",
        ID.unique(),
        {
          createdAt: new Date().toISOString(),
          message: [],
          participants: [user.$id, currentUser.$id],
          updatedAt: new Date().toISOString(),
        }
      );

      const updateUserChats = async (userId) => {
        try {
          let userData;
          try {
            userData = await databases.getDocument(
              "67e55994002fd6e76a8f",
              "user_chats",
              userId
            );
          } catch (error) {
            await databases.createDocument(
              "67e55994002fd6e76a8f",
              "user_chats",
              userId,
              { chats: [newChat.$id] }
            );
            return;
          }

          await databases.updateDocument(
            "67e55994002fd6e76a8f",
            "user_chats",
            userId,
            {
              chats: [...(userData?.chats || []), newChat.$id],
            }
          );
        } catch (error) {
          console.error(`Ошибка обновления чатов для пользователя ${userId}:`, error);
        }
      };

      await Promise.all([
        updateUserChats(user.$id),
        updateUserChats(currentUser.$id),
      ]);

      if (onChatAdded) {
        onChatAdded();
      }

      setUser(null);
    } catch (err) {
      console.error("Ошибка при создании чата:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const response = await databases.listDocuments(
        "67e55994002fd6e76a8f",
        "users",
        [Query.equal("username", username)]
      );

      if (response.documents.length > 0) {
        setUser(response.documents[0]);
      } else {
        console.log("Пользователь не найден");
        setUser(null);
      }
    } catch (err) {
      console.error("Ошибка при запросе:", err);
      setUser(null);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" required />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
