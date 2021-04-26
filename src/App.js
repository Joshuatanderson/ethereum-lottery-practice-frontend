import {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';


// this first application assumes that metamask is installed.
// web 3 gotchas
// metamask AUTOMATICALLY injects a web 3 instance into any webpage.  We want a DIFFERENT one, so 
// we can control it, and use the API we want, instead of an older one.
// Howeer, we do want to rip out the PROVIDER of the old version, since it has the keys
// of the user, and splice it into the new version.

function App() {
  // useEffect(async () => {
  //   const x = await web3.eth.getAccounts()
  //   console.log(x)
  // }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
