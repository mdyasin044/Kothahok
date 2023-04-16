import React, { useEffect, useState, useContext } from "react"
import { SocketContext } from "../../Socket/Context"
import { AiOutlineSend } from "react-icons/ai";
import './Room.css'

const TextBox = ({item}) => {
  return (
    <>
    {item.senderName !== 'SYSTEM101' ? 
      <>
        <div className="TextBox">
          {item.text}
        </div> 
        <div className="TextBoxLabel">
          {item.senderName}
        </div>
      </> : 
      <div className="NotificationBox">
        {item.text}
      </div>
    }
    </>
  )
} 

const TextChat = () => {
    const [text, setText] = useState('')

    const { sendTextMessage, textMessageList } = useContext(SocketContext);

    const sendMessage = () => {
      sendTextMessage(text)
      setText('')
    }

    return (
      <div className="TextChat">
        <div className="TextArea">
          {textMessageList.slice(0).reverse().map((item, index) => {
            return (
              <TextBox key={index} item={item} />
            )
          })}
        </div>
        <div className="TextAreaInput">
          <input value={text} onChange={(e) => setText(e.target.value)} className="InputMessage" placeholder="Send message" />
          <button disabled={text === ''} onClick={() => sendMessage()}>
            <AiOutlineSend size={50} color='hsl(256, 72%, 77%)'/>
          </button>
        </div>
      </div>
    );
}

export default TextChat