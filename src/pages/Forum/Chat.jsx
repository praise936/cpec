import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../servces/api"


function Chat() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [myMessage, setmyMessage] = useState('')
    const [imagemsg, setimage] = useState(null)
    const formData = new FormData()
    formData.append('message',myMessage)
    formData.append('image', imagemsg)

    const fetchPost = async () => {
        setLoading(true)
        try {
            const response = await api.get('seemessages/')
            console.log(response.data);
            setMessages(response.data)

        } catch (err) {
            setError("failed fetching chats")
        }finally{
            setLoading(false)
        }
    }
    const sendMessage = async(e)=>{
        e.preventDefault()
        try {
            const response = await api.post('postmessage/',formData)
            console.log(response);
            fetchPost()
            
        } catch (err) {
            console.log("sending message error", err);
            
        }

    }
    const stel = {
        width:"300px",
        height:"400px",
        borderRadius:"10px",
        boxShadow:"2px 2px 2px black"
    }
    const styl = {
        backgroundColor:"beige",
        display:"flex",
        justifyContent:"center",
        textAlign:"center"
    }
    useEffect(()=>{
        fetchPost()
    },[])
    return(
        <div className="chatContainer" style={styl}>
            {error && <div>{error}</div> }
            <div>Welcome</div>
            <div>
                {messages.map((message, index)=>(
                    <div key={index} style={stel}>
                        <img src={message.image} alt="" />
                        <p>{message.message}</p>
                        <p>{message.sender}</p>

                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <textarea  
                disabled={loading} 
                name="message" 
                onChange={(e)=>setmyMessage(e.target.value)}
                value={myMessage}
                placeholder="what is on your mind"
                ></textarea>
                <input 
                type="file"
                onChange={(e)=>setimage(e.target.files[0])} />
                <button type="submit">{loading ? "send" : "sending..."}</button>
            </form>
        </div>
    )


}
export default Chat