import { useEffect } from "react";
import { account } from "./lib/AppWriteConfig";
import { useUserStore } from "./lib/UserStore";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Login from "./components/login/login";
import Notification from "./components/notification/Notification";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await account.getSession("current"); // Явно получаем сессию
        if (session) {
          const userData = await account.get();
          fetchUserInfo(userData.$id);
        } else {
          fetchUserInfo(null);
        }
      } catch (err) {
        console.error("User is not authenticated:", err);
        fetchUserInfo(null);
      }
    };

    checkAuth();
  }, [fetchUserInfo]); // Добавляем зависимость

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
