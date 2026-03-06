import { useEffect,useState } from "react";
import {
  getBooks,
  getUsers,
  getAllRecords
} from "../services/api";
import "./Dashboard.css";

export default function Dashboard(){

  const [books,setBooks] = useState([]);
  const [users,setUsers] = useState([]);
  const [records,setRecords] = useState([]);

  const [view,setView] = useState(null);
  const [search,setSearch] = useState("");

  const [page,setPage] = useState(1);
  const perPage = 6;

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

  useEffect(()=>{
    loadDashboard();
  },[]);

  const loadDashboard = async ()=>{

    const booksData = (await getBooks()).data;
    const usersData = (await getUsers()).data;
    const recordsData = (await getAllRecords()).data;

    const today = new Date().toISOString().split("T")[0];

    const collectedFine = recordsData
    .filter(r=>r.fineStatus==="PAID")
    .reduce((s,r)=>s+(r.fine||0),0);

    const pendingFine = recordsData
    .filter(r=>r.fine>0 && r.fineStatus!=="PAID")
    .reduce((s,r)=>s+(r.fine||0),0);

    const returned = recordsData.filter(r=>r.returnDate).length;

    const overdue = recordsData.filter(
      r =>
        r.role==="STUDENT" &&
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

  const changeView = (v)=>{
    setView(v);
    setSearch("");
    setPage(1);
  };

  /* ---------- FILTER DATA ---------- */

  let data = [];

  if(view==="BOOKS"){
    data = books.filter(b =>
      b.bookName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if(view==="AVAILABLE"){
    data = books.filter(b =>
      b.status==="AVAILABLE" &&
      b.bookName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if(view==="ISSUED"){
    data = books.filter(b =>
      b.status==="ISSUED" &&
      b.bookName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if(view==="RETURNED"){
    data = records.filter(r =>
      r.returnDate &&
      String(r.accessNo).includes(search)
    );
  }

  if(view==="OVERDUE"){
    data = records.filter(r =>
      r.role==="STUDENT" &&
      !r.returnDate &&
      String(r.memberId).includes(search)
    );
  }

  if(view==="USERS"){
    data = users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.rollNo && u.rollNo.includes(search)) ||
      (u.facultyId && u.facultyId.includes(search))
    );
  }

  if(view==="COLLECTED_FINE"){
    data = records.filter(r =>
      r.fineStatus==="PAID" &&
      String(r.memberId).includes(search)
    );
  }

  if(view==="PENDING_FINE"){
    data = records.filter(r =>
      r.fine>0 &&
      r.fineStatus!=="PAID" &&
      String(r.memberId).includes(search)
    );
  }

  if(view==="TOTAL_FINE"){
    data = records.filter(r =>
      r.fine>0 &&
      String(r.memberId).includes(search)
    );
  }

  const totalPages = Math.ceil(data.length/perPage);
  const start = (page-1)*perPage;
  const paginatedData = data.slice(start,start+perPage);

  return(

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

          <div className="dash-search">

            <input
            placeholder="Search..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            />

          </div>

          <ul>

            {paginatedData.map(item=>(

              <li key={item.accessNo || item.userId || item.recordId}>

                {view==="USERS" && `${item.name} (${item.role})`}

                {view==="BOOKS" && `${item.accessNo} — ${item.bookName} (${item.status})`}

                {view==="AVAILABLE" && `${item.accessNo} — ${item.bookName}`}

                {view==="ISSUED" && `${item.accessNo} — ${item.bookName}`}

                {view==="RETURNED" && `AccessNo ${item.accessNo} → User ${item.memberId}`}

                {view==="OVERDUE" && `User ${item.memberId} — AccessNo ${item.accessNo}`}

                {view==="COLLECTED_FINE" && `User ${item.memberId} — ₹${item.fine}`}

                {view==="PENDING_FINE" && `User ${item.memberId} — ₹${item.fine}`}

                {view==="TOTAL_FINE" && `User ${item.memberId} — ₹${item.fine}`}

              </li>

            ))}

          </ul>

          <div className="pagination">

            <button
            disabled={page===1}
            onClick={()=>setPage(page-1)}
            >
            Prev
            </button>

            <span>
            Page {page} / {totalPages || 1}
            </span>

            <button
            disabled={page===totalPages}
            onClick={()=>setPage(page+1)}
            >
            Next
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

function Card({ label,value,success,danger,onClick }){

  return(

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