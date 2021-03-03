import React, {useEffect, useState} from 'react';
import randomWords from 'random-words';

import './App.css';

function App() {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessages([...messages, {
        text: randomWords({ min: 3, max: 10, join: ' ' }), 
        author: `anonymous`
      }])

    }, 5000)

    return () => clearInterval(intervalId);
  })

  return (
    <div className="App" style={{display: `flex`, flexDirection: `column`, width: `100%`, padding: `10px`}}>
      {messages.map((message, index) => {
        return (
        <div key={message.text} style={{
          border: `1px solid lightgray`, 
          marginBottom: `10px`, 
          padding: `10px`, 
          width: `fit-content`, 
          display: `flex`, 
          flexDirection: `column`, 
          boxShadow: `2px 2px 9px -6px #000000`,
          borderRadius: `5px`
        }}>
          <span style={{color: `gray`, fontSize: 10}}>{message.author} said:</span>
          <span>{message.text}</span>
        </div>

        )
      })} 

      <div style={{position: `absolute`, bottom: 0, left: 0, height: `50px`, width: `100%`, backgroundColor: `gray`}}>
        <input value={value} onChange={e => setValue(e.target.value)} type="text" style={{marginLeft: `10px`, marginTop: `2px`, height: `40px`, width: `800px`}}></input>
        <button style={{marginLeft: `5px`, height: `40px`}} onClick={() => {
                setMessages([...messages, {
                  text: value, 
                  author: `you`
                }])
                setValue('')
        }}>Send</button>
      </div>
    </div>
  );
}

export default App;
