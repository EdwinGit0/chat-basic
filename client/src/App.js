import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';

//const socket = io('http://localhost:4000')
const socket = io()

function App() {

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(message !== ""){
      const newMessage = {
        body: message,
        from: "Me",
        time: getTime()
      }
      socket.emit('message', newMessage)
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const getTime = () => {
    var time = new Date();
    return time.getHours() + ':' + time.getMinutes()
  }

  useEffect(() => {
    const receiveMessage = message => {
      setMessages([...messages, message])
    }
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage)
    }
  },[messages])

  return (
    <main className="main-container h-screen">

      <header className='header'>
        <h1 className='text-2x1 font-bold'>CHAT REACT</h1>
      </header>

      <section className='section-chat'>
        <div className='bg-zinc-900'>
          <ul className='container-messages overflow-y-auto'>
            {messages.map((message, key) => (
              <li key={key} className={`container-messages__message p-2 my-2 table text-sm ${message.from === "Me" ? "color-sky-700 ml-auto" : "color-sky-1000"}`}>
                 <div className={`text-message ${message.from === "Me" ? "message-right" : "message-left"}`}>
                    <p>{message.body}  </p>
                    <p>{message.time}</p>
                  </div>
              </li>
            ))}
          </ul>
        
          <form className='container-form' onSubmit={handleSubmit}>
            <input className='container-form__input' type='text' placeholder='Escribe un mensaje aquí' onChange={e => setMessage(e.target.value)} value={message}/>
            <button className='container-form__button'>▷</button>
          </form>
        </div>
      </section>
     
    </main>
  );
}

export default App;
