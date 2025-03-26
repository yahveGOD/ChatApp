import "./userinfo.css"

const Userinfo = () => {
    return (
      <div className='userinfo'>
        <div className="user">
          <img src="public\pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" alt=""/>
          <h2>UserName</h2>
        </div>

        <div className="icons">
          <img src="public\more.png" alt=""/>
          <img src="public\video1.png" alt=""/>
          <img src="public\edit.png" alt=""/>
        </div>
      </div>
    )
  }
  
  export default Userinfo