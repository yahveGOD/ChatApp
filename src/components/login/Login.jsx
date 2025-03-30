import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { account, databases, storage } from "../../lib/AppWriteConfig";
import { ID } from "appwrite";
import {useUserStore} from "../../lib/UserStore"

const Login = () => {
    const[avatar,setAvatar] = useState({
        file:null,
        url:""
    });
      const {fetchUserInfo} = useUserStore();
    

    const [loading,setLoading] = useState (false)

    const handleAvatar = e => {
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);

        const {username,email,password} = Object.fromEntries(formData);

        try{
            const res = await account.create(ID.unique(), email, password, username)

            let imgUrl = ""
            if (avatar.file) {
                const fileRes = await storage.createFile("67e559a500265e7f88f1", ID.unique(), avatar.file);
                imgUrl = storage.getFilePreview("67e559a500265e7f88f1", fileRes.$id);
            }

            await databases.createDocument(
                "67e55994002fd6e76a8f", 
                "users", 
                res.$id, 
                {
                    username,
                    email,
                    avatar: imgUrl,
                    id: res.$id,
                    blocked: [],
                }
            )

            await databases.createDocument(
                "67e55994002fd6e76a8f", 
                "user_chats", 
                res.$id, 
                {
                    chats: [],
                }
            )
        
        toast.success("Success!")

        }catch(err){

            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
        
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
    
        try {
            await account.createEmailPasswordSession(email, password);
            const session = await account.getSession("current");
            if (session) {
                const userData = await account.get();
                fetchUserInfo(userData.$id);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
      <div className='login'>
        <div className="item">
            <h2>Welcome back</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name = "email"/>
                <input type="password" placeholder="Password" name = "password"/>
                <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
            </form>
        </div>
        <div className="separator"></div>
        <div className="item">
        <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt=""/>
                    Upload an Image</label>

                <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                <input type="text" placeholder="Username" name = "username"/>
                <input type="text" placeholder="Email" name = "email"/>
                <input type="password" placeholder="Password" name = "password"/>
                <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
            </form>
         </div>

      </div>
    )
  }
  
  export default Login