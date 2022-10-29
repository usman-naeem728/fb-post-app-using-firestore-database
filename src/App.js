import './App.css';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  query, onSnapshot, serverTimestamp,
  orderBy, deleteDoc, doc, updateDoc
} from "firebase/firestore";
import { async } from '@firebase/util';
import moment from 'moment/moment';
import profilepic from "./profileimg.jpg";

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

  const [editing, setEditing] = useState({
    editingId: null,
    editingText: ""
  })


  const savePost = async (e) => {
    e.preventDefault();

    console.log("post", posttext, posttitte)

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        posttext: posttext,
        createdon: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  }

  // const updatepost = async (postId, updatetext) => {
  //   await updateDoc(doc(db, "posts", postId), {
  //     text: updatetext
  //   });
  // }


  const updatePost = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "posts", editing.editingId), {
      posttext: editing.editingText
    });

    setEditing({
      editingId: null,
      editingText: ""
    })

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


      const q = query(collection(db, "posts"), orderBy('createdon', 'desc'));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {

          posts.push({ id: doc.id, ...doc.data() });
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
    <div className='main'>
      <div>
        <div className="nav1">
          <h2>Facebook Posts</h2>
        </div>
      </div>


      <div className='container1'>
        <div className='propic'>
          <img src={profilepic} />
        </div>
        <div className='inputpost'>
          <input placeholder="What's in your mind" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled />
        </div>
      </div>



      {/* <!-- Modal --> */}
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header ">
              <h4 className="modal-title text-center" >Create Post</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="input1" onSubmit={savePost}>
                <input  placeholder="What's in your mind" onChange={(e) => {
                  setposttext(e.target.value)
                }} />
                <button className="btn btn-outline-secondary " type="submit">Post</button>
              </form>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
          </div>
        </div>
      </div>
      {/* input search bar  */}
      {/* <div className='container1'>
        <form className="input1 my-5" onSubmit={savePost}>
          <input type="text" className="form-control" placeholder="What's in your mind" onChange={(e) => {
            setposttext(e.target.value)
          }} />
          <button className="btn btn-outline-secondary" type="submit">Save post</button>
        </form>
      </div> */}

      {/* now start posting news  */}
      <div className='container'>






        {
          Post.map((eachPost, i) => (
            <div className={`card mb-3 col-lg-6 col-sm-12 my-3`} key={i} >
              <div className="row g-0">
                <div className="col-md-8">
                  <div className="card-body">
                    <h1 className="card-title"><b> {eachPost.tittle} </b></h1>
                    <h3 className="card-text">
                      <i>
                        {(eachPost.id === editing.editingId) ?
                          <form onSubmit={updatePost}>
                            <input
                              type="text"
                              value={editing.editingText}
                              onChange={(e) => {
                                setEditing({
                                  ...editing,
                                  editingText: e.target.value
                                })
                              }}
                              placeholder="please enter updated value" />
                            <button type="submit">Update</button>
                          </form>
                          :
                          eachPost?.posttext
                        }
                      </i>
                    </h3>
                    <h6>{moment((eachPost?.createdon?.seconds) ?
                      eachPost?.createdon?.seconds * 1000
                      :
                      undefined)
                      .format('MMMM Do YYYY, h:mm a')}</h6>
                  </div>
                  <button onClick={() => {

                    deletePost(eachPost?.id)
                  }
                  } >delete</button>


                  {(editing.editingId === eachPost?.id) ? null :
                    <button onClick={() => {

                      setEditing({
                        editingId: eachPost?.id,
                        editingText: eachPost?.posttext
                      })

                    }} >Edit</button>
                  }
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









