import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Signin() {


    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const loginhandler = (e) => {
        e.preventDefault();


        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("signin sucssfully")
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("signin not sucssfully" , errorMessage)

          });
    }


    return (
        <div>
            <h1>This is signin page</h1>

            <form onSubmit={loginhandler}>
                <input type="text" placeholder="email" onChange={(e) => {
                    setemail(e.target.value)
                }} />
                <input type="password" placeholder="password" onChange={(e) => {
                    setpassword(e.target.value)
                }} />
                <button type="submit">sigin</button>
            </form>

        </div>
    )
}

export default Signin;