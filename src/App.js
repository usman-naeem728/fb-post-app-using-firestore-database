import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Signin from './components/signin';
import Signup from './components/signup';
import Home from './components/home';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



function App() {


  const [login, setlogin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setlogin(true)
      } else {
        // User is signed out
        // ...
        setlogin(false)
      }
    });
    return () => {
      unSubscribe();
    }

  }, [])

  const logoutHandler = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  return (
    <div className='main'>


      {(login) ?
        <ul>
          <li>
            <Link to={`/`} >Home</Link>
          </li>
          <li>
            <button onClick={logoutHandler}>logout</button>
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









