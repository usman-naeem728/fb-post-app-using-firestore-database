import './App.css';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { query, onSnapshot } from "firebase/firestore";
import { async } from '@firebase/util';
import moment from 'moment/moment';


const firebaseConfig = {
  apiKey: "AIzaSyDSn9S0e11dBXK2hAfD6o5uo_-lJxeQEiQ",
  authDomain: "fb-post-database.firebaseapp.com",
  projectId: "fb-post-database",
  storageBucket: "fb-post-database.appspot.com",
  messagingSenderId: "568164527886",
  appId: "1:568164527886:web:0dbc6f6c93160da279f15f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function App() {

  const [Post, setpost] = useState([])
  const [posttext, setposttext] = useState("")
  const [posttitte, setposttittle] = useState("")




  const savePost = async (e) => {
    e.preventDefault();

    console.log("post", posttext, posttitte)

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        tittle: posttitte,
        posttext: posttext,
        createdon: new Date().getTime(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }



  useEffect(() => {

    const getData = async () => {


      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());

        setpost((prev) => {
          let newarr = [...prev, doc.data()]
          return newarr
        })


      });
    }

    // getData();

    let unsubscribe = null;
    const getrealtimedata = async () => {


      const q = query(collection(db, "posts"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());
        });

        setpost(posts)


        console.log("posts: ", posts);


      });


    }

    getrealtimedata()

    return () => {
      unsubscribe();
    }

  }, [])



  return (
    <div >
      <div>
        <div className="nav1">
          <h2>Facebook Posts</h2>
        </div>
      </div>




      {/* input search bar  */}
      <div className='container'>
        <form className="input-group my-5" onSubmit={savePost}>
          <input type="text" placeholder="Enter your tittle" onChange={(e) => {
            setposttittle(e.target.value)
          }} />
          <br />
          <textarea type="text" className="form-control" placeholder="What's in your mind" onChange={(e) => {
            setposttext(e.target.value)
          }} />
          <button className="btn btn-outline-secondary" type="submit">Save post</button>
        </form>
      </div>

      {/* now start posting news  */}
      <div className='container'>






        {
          Post.map((eachPost, i) => (
            <div className={`card mb-3 col-lg-6 col-sm-12 my-3`} key={i} >
              <div className="row g-0">
                <div className="col-md-8">
                  <div className="card-body">
                    <h1 className="card-title"><b> {eachPost.tittle} </b></h1>
                    <p className="card-text"><i> {eachPost.posttext} </i></p>
                    <h6>{moment(eachPost.createdon).format('MMMM Do YYYY, h:mm:ss a')}</h6>
                  </div>
                </div>
              </div>
            </div>
          ))
        }




      </div>
    </div>



  );
}

export default App;









