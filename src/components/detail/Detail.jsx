import "./detail.css"


const Detail = () => {
    return (
      <div className='detail'>
        <div className="user">
          <img src="./avatar.png" alt=""/>
          <h2>UserName</h2>
          <p>Lorem asdasdasdaf </p>
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
              <span>Shared Photos</span>
              <img src="./arrowDown.png" alt=""/>
            </div>
            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoBuMvSuYezLE9rwI-zOJeIOmcIGfDPqOvFA&s" alt=""/>
                  <span>photo_name.png</span>
                </div>
                <img src="./download.png" alt="" className="icon"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoBuMvSuYezLE9rwI-zOJeIOmcIGfDPqOvFA&s" alt=""/>
                  <span>photo_name.png</span>
                </div>
                <img src="./download.png" alt="" className="icon"/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoBuMvSuYezLE9rwI-zOJeIOmcIGfDPqOvFA&s" alt=""/>
                  <span>photo_name.png</span>
                </div>
                <img src="./download.png" alt="" className="icon"/>
              </div>
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img src="./arrowUp.png" alt=""/>
            </div>
          </div>
        </div>
        <button>Block User</button>
      </div>
    )
  }
  
  export default Detail