import "./Sidebar.css";

export default function Sidebar({ page, setPage, open, setOpen }) {

  const handleClick = (p) => {
    setPage(p);
    setOpen(false); 
  };

  return (
    <>
      <div className="mobile-header">
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
        {/* <h2>📚 Library</h2> */}
      </div>
      
      <div className={`sidebar ${open ? "show" : ""}`}>
        <h2 className="library-title">
          <span className="emoji">📚</span>
          <span className="text">Library</span>
        </h2>

        <button className={page === "dashboard" ? "active" : ""} onClick={() => handleClick("dashboard")}>
          <span>📊 Dashboard</span>
        </button>

        <button className={page === "users" ? "active" : ""} onClick={() => handleClick("users")}>
          <span>👥 Users</span>
        </button>

        <button className={page === "books" ? "active" : ""} onClick={() => handleClick("books")}>
          <span>📘 Books</span>
        </button>

        <button className={page === "issue" ? "active" : ""} onClick={() => handleClick("issue")}>
          <span>📖 Issue Book</span>
        </button>

        <button className={page === "return" ? "active" : ""} onClick={() => handleClick("return")}>
          <span>🔄 Return Book</span>
        </button>

        <button className={page === "records" ? "active" : ""} onClick={() => handleClick("records")}>
          <span>🧾 Records</span>
        </button>
       
        <button className={page === "profile" ? "active" : ""}onClick={() => setPage("profile")}>
          <span>👤 Profile</span>
        </button>

      </div>
    </>
  );
}
