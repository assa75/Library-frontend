import { useState } from "react";
import "./Auth.css";

export default function Login({ setIsAuth, setAuthPage }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = (e)=>{
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u)=>u.email === email && u.password === password
    );

    if(user){

      localStorage.setItem("auth","true");

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      setIsAuth(true);

    }else{
      alert("Invalid email or password");
    }

  };

  return(

    <div className="auth-page">

      <div className="auth-container">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p onClick={()=>setAuthPage("signup")}>
          Create new account
        </p>

      </div>

    </div>
  );
}