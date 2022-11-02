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
import axios from 'axios';
import profilepic from "./profileimg.jpg";
import like from "./like.png";
import share from "./share.png";
import comment from "./comment.png";
import more from "./more.png";
import delet from "./delete.png";
import edit from "./edit.png";
import image from "./image.png"

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
  const [img, setimg] = useState(null);
  const [editing, setEditing] = useState({
    editingId: null,
    editingText: ""
  })


  const savePost = async (e) => {
    e.preventDefault();

    // console.log("post", posttext, posttitte)

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        posttext: posttext,
        createdon: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }



    const cloudinaryData = new FormData();
    cloudinaryData.append("file", img);
    cloudinaryData.append("upload_preset", "imagedatabase");
    cloudinaryData.append("cloud_name", "dhgxgvpmw");
    console.log(cloudinaryData);
    axios.post(`https://api.cloudinary.com/v1_1/dhgxgvpmw/image/upload`,
      cloudinaryData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(async res => {

        console.log("from then", res.data);

        console.log("post", posttext, posttitte)

        try {
          const docRef = await addDoc(collection(db, "posts"), {
            posttext: posttext,
            createdon: serverTimestamp(),
            postimg: res?.data?.url,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch(err => {
        console.log("from catch", err);
      })
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
        <div className='postbox'>
          <div className='propic'>
            <img src={profilepic} />
          </div>
          <div className='inputpost'>
            <input placeholder="What's in your mind" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled />
          </div>
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
                <input placeholder="What's in your mind" onChange={(e) => {
                  setposttext(e.target.value)
                }} />
                <div className='upload'>
                  <img src={image} /> <span> <input type="file" onChange={(e) => {
                    setimg(e.currentTarget.files[0])
                  }} /> upload image</span>
                  {console.log(img)}
                </div>
                <button className="btn btn-outline-secondary " type="submit" data-bs-dismiss="modal" aria-label="Close">Post</button>
              </form>
            </div>
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







      {
        Post.map((eachPost, i) => (
          <div className="card col-lg-6 my-3" key={i} >
            {/* <div className="row g-0 "> */}
            <div className="col-md-8">
              <div className="card-body">
                <div className='posttittle'>
                  <img src={profilepic} />
                  <h6 className="card-title"> Muhammad Usman Naeem
                    <br />
                    <span>
                      {moment((eachPost?.createdon?.seconds) ?
                        eachPost?.createdon?.seconds * 1000
                        :
                        undefined)
                        .format('Do MMMM YYYY  h:mm a')}
                    </span>
                  </h6>
                </div>
                <div className='more '>
                  <div className='dropdown'>

                    <img src={more} className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" />

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      <li onClick={() => {

                        deletePost(eachPost?.id)
                      }
                      } >
                        <a className="dropdown-item" href="#">
                          <img src={delet} />
                          Delete Post </a>
                      </li>

                      {/* <li>
                        <a className="dropdown-item" href="#"> */}
                      {(editing.editingId === eachPost?.id) ? null :
                        <li
                          onClick={() => {
                            setEditing({
                              editingId: eachPost?.id,
                              editingText: eachPost?.posttext
                            })

                          }}>
                          <a className="dropdown-item" href="#"  >
                            <img src={edit} />
                            Edit Post
                          </a>
                        </li>
                      }
                      {/* </a>
                      </li> */}
                    </ul>

                  </div>
                </div>
                <div className='postText my-5'>

                  <h3 className="card-text">

                    {(eachPost.id === editing.editingId) ?
                      <form onSubmit={updatePost} className="updateform" >
                        <input
                          id='updateinput'
                          type="text"
                          value={editing.editingText}
                          onChange={(e) => {
                            setEditing({
                              ...editing,
                              editingText: e.target.value
                            })
                          }}
                          placeholder="please enter updated value" />
                        <button type="submit" className='btn btn-outline-success'>Update</button>
                      </form>
                      :
                      eachPost?.posttext
                    }

                  </h3>
                </div>

              </div>
              {(img === null)? "" :
                <div className='postimg'>
                  <img src={eachPost.postimg} />
                </div>
              }
              <div className="btns mx-2">
                <div className="like"><img src={like} alt="" />
                  <span>Like</span>
                </div>
                <div className="comment"><img src={comment} alt="" />
                  <span>Comment</span>
                </div>
                <div className="share"><img src={share} />
                  <span>Share</span>
                </div>
              </div>




            </div>
          </div>
          // </div>
        ))
      }




    </div>




  );
}

export default App;









