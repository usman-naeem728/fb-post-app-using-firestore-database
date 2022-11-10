import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Signin from './components/signin';
import Signup from './components/signup';
import Home from './components/home';




function App() {


  const [login, setlogin] = useState(true);



  return (
    <div className='main'>
      <button onClick={() => {
        setlogin(!login)
      }} >{
          (login) ?
            "Logout"
            :
            "login"
        }</button>

      {(login) ?
        <ul>
          <li>
            <Link to={`/`} >Home</Link>
          </li>
        </ul> :
        <ul>
          <li>
            <Link to={`/`} >Signin</Link>
          </li>
          <li>
            <Link to={`/signup`} >Signup</Link>
          </li>
        </ul>
      }
      {(login) ?
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="Signup" element={<Signup />} />
        </Routes>
      }



    </div>




  );
}

export default App;









