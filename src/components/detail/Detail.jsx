import { toast } from "react-toastify";
import { account, databases } from "../../lib/AppWriteConfig"
import { useUserStore } from "../../lib/UserStore";
import "./detail.css"
import { useChatStore } from "../../lib/ChatStore";


const Detail = () => {

  const { currentUser,logout } = useUserStore(); 

  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock} = useChatStore()


  const handleBlock = async () => {
    if (!currentUser || !user) return;
  
    try {
      const userDoc = await databases.getDocument(
        "67e55994002fd6e76a8f", 
        "users", 
        currentUser.$id 
      );
  
      await databases.updateDocument(
        "67e55994002fd6e76a8f",
        "users", 
        currentUser.$id, 
        {
          blocked: isReceiverBlocked 
            ? userDoc.blocked.filter(id => id !== user.$id) 
            : [...(userDoc.blocked || []), user.$id] 
        }
      );
  
      changeBlock();
      
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  const handleLogout = async () => {
    try {
        await logout();
        toast.success("Logout...")
    } catch (err) {
        console.log("Logout error:", err);
    }
};

    return (
      <div className='detail'>
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt=""/>
          <h2>{user?.username}</h2>
        </div>
        <div className="info">
          <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img src="./arrowUp.png" alt=""/>
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Privacy and Help</span>
              <img src="./arrowUp.png" alt=""/>
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img src="./arrowUp.png" alt=""/>
            </div>
          </div>
        </div>
        <button onClick={handleBlock}> {
          isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User blocked" : "Block User"
          
          }</button>
        <button className="logout" onClick={() => handleLogout()}>Logout</button>
        </div>
    )
  }
  
  export default Detail