import { useEffect, useState, useRef } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"

const Chat = () => {

  const[open,setOpen] = useState(false);
  const[text,setText] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"});
  },[]);

  const handleEmoji = (e) => {
    console.log(e);
    setText((prev) => prev + e.emoji);
  }; 


    return (
      
      <div className='chat'>
        <div className="top">
          <div className="user">
            <img src="./avatar.png" alt =""/>
            <div className="texts">
              <span>User</span>
              <p>Lorem ipsum dolor sit amet</p>
            </div>
          </div>
          <div className="icons">
            <img src="./phone1.png" alt=""/>
            <img src="./video1.png" alt=""/>
            <img src="./info.png" alt=""/>
          </div>

        </div>
        <div className="center">
          <div className="message">
            <img src="./avatar.png" alt=""/>
            <div className="texts">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt=""/>
            <div className="texts">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoBuMvSuYezLE9rwI-zOJeIOmcIGfDPqOvFA&s" alt=""/>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt=""/>
            <div className="texts">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message">
            <img src="./avatar.png" alt=""/>
            <div className="texts">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div className="message own">
            <div className="texts">
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore vitae voluptatem et praesentium illum aut, quas nostrum, minima tenetur reprehenderit temporibus? Sint quibusdam repellendus commodi, voluptatum ullam ipsum consectetur?</p>
              <span>1 min ago</span>
            </div>
          </div>
          <div ref = {endRef}></div>
        </div>
        <div className="bottom">
          <div className="icons">
            <img src="./img.png" alt=""/>
            <img src="./camera.png" alt=""/>
            <img src="./mic.png" alt=""/>
          </div>
          <input type="text"
          placeholder="Type a Message"
          value={text}
          onChange={(e)=>setText(e.target.value)}/>
          <div className="emoji">
            <img src = "./emoji1.png" alt="" onClick={()=>setOpen(prev => !prev)}/>
            <div className="picker">
             <EmojiPicker open = {open} onEmojiClick={handleEmoji}/>
            </div>
          </div>
          <button className="sendButton">Send</button>
        </div>
      </div>
    )
  }
  
  export default Chat