import { useState } from "react";
import "./Auth.css";

export default function Signup({ setAuthPage }) {

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const[show,setShow] = useState(false);

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSignup = (e)=>{
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(form);

    localStorage.setItem("users",JSON.stringify(users));

    alert("Signup successful");

    setAuthPage("login");
  };

  return(

    <div className="auth-page">

      <div className="auth-container">

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          /><br/><br/>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          /><br/><br/>

          <div className="password-box">

          <input
          type={show ? "text" : "password"}
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          required
          />

          <span
          className="toggle"
          onClick={()=>setShow(!show)}
          >
          {show ? "👁️" : "🙈"}
          </span>

          </div>

          <button type="submit">
            Signup
          </button>

        </form>

        <p onClick={()=>setAuthPage("login")}>
          Already have account? Login
        </p>

      </div>

    </div>
  );
}