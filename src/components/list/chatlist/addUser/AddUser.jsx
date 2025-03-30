import { useState } from "react"
import { databases } from "../../../../lib/AppWriteConfig"
import "./addUser.css"
import { Query } from "appwrite"

const AddUser = () => {

  const[user,setUser] = useState(null)

  const handleSearch = async e =>{
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      const response = await databases.listDocuments(
        "67e55994002fd6e76a8f",  
        "users",
        [
          Query.equal("username", username)
        ]
      );
      if (response.documents.length > 0) {
        setUser(response.documents[0]);
      } else {
        console.log("Пользователь не найден");
      }
      
    } catch (err) {
      console.error("Ошибка при запросе:", err);
    }
  }

  return (
    <div className='addUser'>
        <form onSubmit={handleSearch}>
            <input type="text" placeholder="Username" name = "username" />
            <button>Search</button>
        </form>
        {user && <div className="user">
            <div className="detail">
                <img src={user.avatar || "./avatar.png"} alt=""/>
                <span>{user.username}</span>
            </div>
            <button>Add User</button>
        </div>}
    </div>
  )
}

export default AddUser