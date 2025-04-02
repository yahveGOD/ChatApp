import { useEffect, useState, useRef } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/UserStore";
import { client, databases } from "../../../lib/AppWriteConfig";
import { useChatStore } from "../../../lib/ChatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const {chatId, changeChat } = useChatStore();
  const chatSubscriptions = useRef([]);


  // Функция загрузки чатов
  const fetchChats = async () => {
    if (!currentUser?.$id) return;

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

      const chatDetails = await Promise.all(
        userChats.chats.map(async (id) => {
          try {
            const chatDoc = await databases.getDocument(
              "67e55994002fd6e76a8f",
              "67e94a480016ebaba40f",
              id
            );

            if (!chatDoc?.participants?.includes(currentUser.$id)) {
              return null;
            }

            const receiverId = chatDoc.participants.find(
              (id) => id !== currentUser.$id
            );
            const userDoc = await databases.getDocument(
              "67e55994002fd6e76a8f",
              "users",
              receiverId
            );


            return {
              chatId: id,
              receiverId,
              user: userDoc,
              lastMessage: chatDoc.lastMessage || "No messages yet",
              updatedAt: chatDoc.updatedAt || chatDoc.$createdAt,
            };
          } catch (error) {
            console.log(error);
            return null;
          }
        })
      );

      const validChats = chatDetails.filter((chat) => chat !== null);
      setChats(validChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      console.log(err);
    }
  };

  // Подписка на изменения списка чатов пользователя
  useEffect(() => {
    if (!currentUser?.$id) return;

    fetchChats();

    const unsubscribeUserChats = client.subscribe(
      `databases.67e55994002fd6e76a8f.collections.user_chats.documents.${currentUser.$id}`,
      fetchChats
    );

    return () => {
      unsubscribeUserChats();
    };
  }, [currentUser?.$id]);

  // Подписка на изменения сообщений в каждом чате
  useEffect(() => {
    if (!currentUser?.$id || chats.length === 0) return;

    chatSubscriptions.current.forEach((unsub) => unsub());
    chatSubscriptions.current = [];

    chats.forEach((chat) => {
      const subscription = client.subscribe(
        `databases.67e55994002fd6e76a8f.collections.67e94a480016ebaba40f.documents.${chat.chatId}`,
        (response) => {
          if (response.events.some(e => e.includes(".update"))) {
            setChats((prevChats) =>
              prevChats
                .map((c) =>
                  c.chatId === chat.chatId
                    ? {
                        ...c,
                        lastMessage: response.payload.lastMessage || c.lastMessage,
                        updatedAt: response.payload.updatedAt || c.updatedAt,
                      }
                    : c
                )
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            );

          }
        }
      );

      chatSubscriptions.current.push(subscription);
    });

    return () => {
      chatSubscriptions.current.forEach((unsub) => unsub());
      chatSubscriptions.current = [];
    };
  }, [chats, currentUser?.$id]);

  const handleSelect = (chat) => {
    changeChat(chat.chatId, chat.user);
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchbar">
          <img src="public/search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          className="add"
          src={addMode ? "./minus.png" : "./add.png"}
          alt=""
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {chats.map((chat) => (
        <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
          <img src={chat.user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user?.username || "Unknown"}</span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser onChatAdded={fetchChats} />}
    </div>
  );
};

export default ChatList;
