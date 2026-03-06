import "./Profile.css";

export default function Profile({ setIsAuth }) {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = ()=>{
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser");
    setIsAuth(false);
  };

  return(

    <div className="profile-page">

      <h2>My Profile</h2>

      <div className="profile-card">

        <div className="avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>
  );
}