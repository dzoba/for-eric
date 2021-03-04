import React, {useEffect, useState} from 'react';
import randomWords from 'random-words';
import { TezosToolkit } from '@taquito/taquito';
import './App.css';
const tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

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

  const submit = () => {
    setMessages([...messages, {
      text: value, 
      author: `you`
    }])
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  const accessTezosNetwork = () => {
    tezos.tz
    .getBalance('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY')
    .then((balance) => {
      setMessages([...messages, {
        text: `${balance.toNumber() / 1000000} ꜩ`, 
        author: `Tezos Network`
      }])
    })
    .catch((error) => console.log(JSON.stringify(error)));
  }

  return (
    <div className="App" style={{display: `flex`, flexDirection: `column`, width: `100%`, padding: `10px`, marginBottom: `50px`}}>
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
          borderRadius: `5px`,
        }}>
          <span style={{color: `gray`, fontSize: 10}}>{message.author} said:</span>
          <span>{message.text}</span>
        </div>

        )
      })} 

      <div style={{position: `fixed`, bottom: 0, left: 0, height: `50px`, width: `100%`, backgroundColor: `gray`}}>
        <input value={value} onKeyDown={handleKeyDown} onChange={e => setValue(e.target.value)} type="text" style={{marginLeft: `10px`, marginTop: `2px`, height: `40px`, width: `800px`}}></input>
        <button style={{marginLeft: `5px`, height: `40px`}} onClick={submit} >Send</button>
        <button onClick={accessTezosNetwork}>Access Tezos Network </button>
      </div>
    </div>
  );
}

export default App;
