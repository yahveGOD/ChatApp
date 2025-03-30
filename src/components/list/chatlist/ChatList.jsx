import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser"
import {useUserStore} from "../../../lib/UserStore"
import { client } from "../../../lib/AppWriteConfig"

const ChatList = () => {
    const[addMode,setAddMode]= useState(false)
    const[chats,setChats]= useState([])


    const{currentUser} = useUserStore();

    useEffect(() => {
      const unsubscribe = client.subscribe(`databases.67e55994002fd6e76a8f.collections.user_chats.documents.${currentUser.id}`,
        async (response) => {
          if (response.events.includes("databases.*.collections.*.documents.*.update")) {
            const items = response.payload.chats;
    
            const promises = items.map(async (item) => {
              try {
                const userResponse = await databases.getDocument(
                  "67e55994002fd6e76a8f",
                  'users',
                  item.receiverId
                );
                
                return { ...item, user: userResponse };
              } catch (error) {
                console.error("Error fetching user data:", error);
                return { ...item, user: null };
              }
            });
    
            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a,b)=> b.updatedAt - a.updatedAt));

          }
        }
      );
      ;
    
      return () => {
        unsubscribe();
      };
    }, [currentUser.id]);

    return (
      <div className='chatList'>
        <div className="search">
          <div className="searchbar">
            <img src="public\search.png" alt=""/>
            <input type="text" placeholder="Search"/>
          </div>
          <img className="add" src={addMode ? "./minus.png":"./add.png"} atl=""
          onClick={()=> setAddMode((prev)=>!prev)}
          />
        </div>
        {chats.map((chat) => (
        <div className="item" key={chat.chatId}>
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>chat.lastMessage</p>
          </div>
        </div>))}
        
        {addMode && <AddUser/>}
      </div>
    )
  }
  
  export default ChatList