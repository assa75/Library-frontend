import { useState } from "react";
import "./App.css";

import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Books from "./pages/Books";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import Records from "./pages/Records";
import Profile from "./pages/Profile";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

function App() {

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("auth") === "true"
  );

  const [authPage, setAuthPage] = useState("login");

  const [page, setPage] = useState("dashboard");

  const [open, setOpen] = useState(false);

  if (!isAuth) {

    if (authPage === "login") {
      return (
        <Login
          setIsAuth={(value)=>{
            setIsAuth(value);
            if(value){
              localStorage.setItem("auth","true");
            }
          }}
          setAuthPage={setAuthPage}
        />
      );
    }

    return (
      <Signup
        setAuthPage={setAuthPage}
      />
    );
  }


  /* MAIN APPLICATION */

  return (

    <div className="layout">

      <Sidebar
        page={page}
        setPage={(p)=>{
          setPage(p);
          setOpen(false); 
        }}
        open={open}
        setOpen={setOpen}
      />

      <div className="main">

        <Header
          setIsAuth={(value)=>{
            setIsAuth(value);
            if(!value){
              localStorage.removeItem("auth");
            }
          }}
        />
        

        {page === "dashboard" && <Dashboard />}
        {page === "users" && <Users />}
        {page === "books" && <Books />}
        {page === "issue" && <IssueBook />}
        {page === "return" && <ReturnBook />}
        {page === "records" && <Records />}
        {page === "profile" && <Profile setIsAuth={setIsAuth} />}

      </div>

    </div>

  );
}

export default App;