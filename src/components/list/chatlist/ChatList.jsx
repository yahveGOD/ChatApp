import { useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser"

const ChatList = () => {
    const[addMode,setAddMode]= useState(false)
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
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt =""/>
          <div className="texts">
            <span>UserName</span>
            <p>Message</p>
          </div>
        </div>
        {addMode && <AddUser/>}
      </div>
    )
  }
  
  export default ChatList