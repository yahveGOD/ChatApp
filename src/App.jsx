import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Chat from "./components/chat/Chat"
import Login from "./components/login/login"
import Notification from "./components/notification/Notification"
import { useEffect } from "react";
import { account } from "./lib/AppWriteConfig";
import {useUserStore} from "./lib/UserStore"

const App = () => {


  const {currentUser,isLoading, fetchUserInfo} = useUserStore();


  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
            
            const userData = await account.get();
            fetchUserInfo(userData.$id)
    };

    checkAuth();

    return () => {
        isMounted = false;
    };
}, [fetchUserInfo]);

  console.log(currentUser)

  if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (   
          <>  
            <List/>
            <Chat/>
            <Detail/>
          </> 
        ) : (<Login/>)
      }
      <Notification/>
    </div>
  )
}

export default App