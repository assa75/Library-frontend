import { useEffect,useState } from "react";
import {
  getBooks,
  getUsers,
  getAllRecords
} from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {

  const [books,setBooks] = useState([]);
  const [users,setUsers] = useState([]);
  const [records,setRecords] = useState([]);

  const [view,setView] = useState(null);
  const [search,setSearch] = useState("");

  const [stats,setStats] = useState({
    totalBooks:0,
    available:0,
    issued:0,
    returned:0,
    overdue:0,
    users:0,
    totalFine:0,
    collectedFine:0,
    pendingFine:0
  });

  useEffect(() => {
    loadDashboard();
  },[]);

  const loadDashboard = async () => {
    const booksData = (await getBooks()).data;
    const usersData = (await getUsers()).data;
    const recordsData = (await getAllRecords()).data;

    const today = new Date().toISOString().split("T")[0];

    const collectedFine = recordsData
      .filter(r => r.fineStatus === "PAID")
      .reduce((s,r)=>s+(r.fine||0),0);

    const pendingFine = recordsData
      .filter(r => r.fine > 0 && r.fineStatus !== "PAID")
      .reduce((s,r)=>s+(r.fine||0),0);

    const returned = recordsData.filter(r => r.returnDate).length;

    const overdue = recordsData.filter(
      r =>
        r.role === "STUDENT" &&
        !r.returnDate &&
        r.dueDate < today
    ).length;

    setBooks(booksData);
    setUsers(usersData);
    setRecords(recordsData);

    setStats({
      totalBooks: booksData.length,
      available: booksData.filter(b=>b.status==="AVAILABLE").length,
      issued: booksData.filter(b=>b.status==="ISSUED").length,
      returned,
      overdue,
      users: usersData.length,
      collectedFine,
      pendingFine,
      totalFine: collectedFine + pendingFine
    });
  };

  const changeView = (v) => {
    setView(v);
    setSearch("");
  };

  return (
    <div className="dashboard">

      <h2 className="dash-title">📊 Library Dashboard</h2>

      <div className="dash-cards">
        <Card label="Total Books" value={stats.totalBooks} onClick={()=>changeView("BOOKS")} />
        <Card label="Available Books" value={stats.available} onClick={()=>changeView("AVAILABLE")} />
        <Card label="Issued Books" value={stats.issued} onClick={()=>changeView("ISSUED")} />
        <Card label="Returned Books" value={stats.returned} success onClick={()=>changeView("RETURNED")} />
        <Card label="Overdue Books" value={stats.overdue} danger onClick={()=>changeView("OVERDUE")} />
        <Card label="Total Users" value={stats.users} onClick={()=>changeView("USERS")} />
        <Card label="Collected Fine" value={`₹ ${stats.collectedFine}`} success onClick={()=>changeView("COLLECTED_FINE")} />
        <Card label="Pending Fine" value={`₹ ${stats.pendingFine}`} danger onClick={()=>changeView("PENDING_FINE")} />
        <Card label="Total Fine" value={`₹ ${stats.totalFine}`} onClick={()=>changeView("TOTAL_FINE")} />
      </div>

      {view && (
        <div className="dash-data">

          {/* SEARCH */}
          <div className="dash-search">
            <input
              placeholder="Search..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>

          {view==="BOOKS" && (
            <>
              <h3>📚 All Books</h3>
              <ul>
                {books
                  .filter(b =>
                    b.bookName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(b=>(
                    <li key={b.accessNo}>
                      {b.accessNo} — {b.bookName} ({b.status})
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="AVAILABLE" && (
            <>
              <h3>✅ Available Books</h3>
              <ul>
                {books
                  .filter(b =>
                    b.status==="AVAILABLE" &&
                    b.bookName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(b=>(
                    <li key={b.accessNo}>
                      {b.accessNo} — {b.bookName}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="ISSUED" && (
            <>
              <h3>📤 Issued Books</h3>
              <ul>
                {books
                  .filter(b =>
                    b.status==="ISSUED" &&
                    b.bookName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(b=>(
                    <li key={b.accessNo}>
                      {b.accessNo} — {b.bookName}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="RETURNED" && (
            <>
              <h3>📥 Returned Records</h3>
              <ul>
                {records
                  .filter(r =>
                    r.returnDate &&
                    String(r.accessNo).includes(search)
                  )
                  .map(r=>(
                    <li key={r.recordId}>
                      AccessNo {r.accessNo} → User {r.userId}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="OVERDUE" && (
            <>
              <h3>⏰ Overdue Students</h3>
              <ul>
                {records
                  .filter(r =>
                    r.role==="STUDENT" &&
                    !r.returnDate &&
                    String(r.userId).includes(search)
                  )
                  .map(r=>(
                    <li key={r.recordId}>
                      User {r.userId} — AccessNo {r.accessNo}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="USERS" && (
            <>
              <h3>👥 Users</h3>
              <ul>
                {users
                  .filter(u =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    (u.rollNo && u.rollNo.includes(search)) ||
                    (u.facultyId && u.facultyId.includes(search))
                  )
                  .map(u=>(
                    <li key={u.userId}>
                      {u.name} ({u.role})
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="COLLECTED_FINE" && (
            <>
              <h3>💰 Collected Fines</h3>
              <ul>
                {records
                  .filter(r =>
                    r.fineStatus==="PAID" &&
                    String(r.userId).includes(search)
                  )
                  .map(r=>(
                    <li key={r.recordId}>
                      User {r.userId} — ₹{r.fine}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="PENDING_FINE" && (
            <>
              <h3>⚠️ Pending Fines</h3>
              <ul>
                {records
                  .filter(r =>
                    r.fine>0 &&
                    r.fineStatus!=="PAID" &&
                    String(r.userId).includes(search)
                  )
                  .map(r=>(
                    <li key={r.recordId}>
                      User {r.userId} — ₹{r.fine}
                    </li>
                ))}
              </ul>
            </>
          )}

          {view==="TOTAL_FINE" && (
            <>
              <h3>📊 All Fine Records</h3>
              <ul>
                {records
                  .filter(r =>
                    r.fine>0 &&
                    String(r.userId).includes(search)
                  )
                  .map(r=>(
                    <li key={r.recordId}>
                      User {r.userId} — ₹{r.fine}
                    </li>
                ))}
              </ul>
            </>
          )}

        </div>
      )}

    </div>
  );
}

function Card({ label,value,success,danger,onClick }) {
  return (
    <div
      className={`dash-card ${success?"success":""} ${danger?"danger":""}`}
      onClick={onClick}
      style={{cursor:"pointer"}}
    >
      <span>{label}</span>
      <h3>{value}</h3>
    </div>
  );
}
