import React, {useEffect, useState} from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

import './App.css';
const faucet = require('./faucet.json')
const tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

const contractAddress = `KT1QDM6Bv181yaZXhQcTjZRTK8UZTvfidjmU`

importKey(
  tezos,
  faucet.email,
  faucet.password,
  faucet.mnemonic.join(' '),
  faucet.secret
).catch((e) => console.error(e));

function App() {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      tezos.contract
        .at(contractAddress)
        .then((contract) => {
          contract.storage().then(res => {          
            setMessages(res.messages)
          })
        })
        .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    }, 5000)

    return () => clearInterval(intervalId);
  })

  const submit = () => {
    tezos.contract
    .at(contractAddress)
    .then((contract) => {
      return contract.methods.post(value).send();
    })
    .then((op) => {
      console.log(`Awaiting for ${op.hash} to be confirmed...`);
      return op.confirmation(3).then(() => op.hash);
    })
    .then((hash) => console.log(`Operation injected: https://edo.tzstats.com/${hash}`))
    .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  const rocket = () => {
    tezos.contract
    .at(contractAddress)
    .then((contract) => {
      return contract.methods.rocket([["1"]]).send();
    })
    .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
  }

  return (
    <div className="App" style={{display: `flex`, flexDirection: `column`, width: `100%`, padding: `10px`, marginBottom: `50px`}}>
      {messages.map((message) => {
        return (
        <div key={message.timestamp} style={{
          border: `1px solid lightgray`, 
          marginBottom: `10px`, 
          padding: `10px`, 
          width: `fit-content`, 
          display: `flex`, 
          flexDirection: `column`, 
          boxShadow: `2px 2px 9px -6px #000000`,
          borderRadius: `5px`,
        }}>
          <span style={{color: `gray`, fontSize: 10}}>{message.sender} said:</span>
          <span>{message.text}</span>
        </div>

        )
      })} 

      <div style={{position: `fixed`, bottom: 0, left: 0, height: `50px`, width: `100%`, backgroundColor: `gray`}}>
        <input value={value} onKeyDown={handleKeyDown} onChange={e => setValue(e.target.value)} type="text" style={{marginLeft: `10px`, marginTop: `2px`, height: `40px`, width: `800px`}}></input>
        <button style={{marginLeft: `5px`, height: `40px`}} onClick={submit} >Send</button>
        <button onClick={rocket}>rocket!</button>
      </div>
    </div>
  );
}

export default App;
