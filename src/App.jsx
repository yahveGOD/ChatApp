import Detail from "./components/detail/Detail"
import List from "./components/list/list"
import Chat from "./components/chat/Chat"

const App = () => {
  return (
    <div className='container'>
      <List/>
      <Chat/>
      <Detail/>
    </div>
  )
}

export default App