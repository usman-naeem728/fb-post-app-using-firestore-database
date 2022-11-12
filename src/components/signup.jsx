import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";







function Signup() {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const signuphandler = (e) => {
        e.preventDefault();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("signup successfully")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("signup not successfully",errorCode,errorMessage)

            });
    }


    return (
        <div>
            <h1>This is Signup page</h1>
            <form onSubmit={signuphandler}>
                <input type="text" placeholder="email" onChange={(e) => {
                    setemail(e.target.value)
                }} />
                <input type="password" placeholder="password" onChange={(e) => {
                    setpassword(e.target.value)
                }} />
                <input type="password" placeholder="re-password" />
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default Signup;