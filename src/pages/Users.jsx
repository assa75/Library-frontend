import { useEffect,useState } from "react";
import { getUsers,addUser } from "../services/api";
import "./Users.css";

const ROLES = ["STUDENT","FACULTY"];

export default function Users(){

  const [users,setUsers] = useState([]);
  const [saving,setSaving] = useState(false);
  const [roleSearch,setRoleSearch] = useState("");
  const [showRoles,setShowRoles] = useState(false);

  const [page,setPage] = useState(1);
  const perPage = 5;

  const [form,setForm] = useState({
    name:"",
    role:"STUDENT",
    rollNo:"",
    facultyId:""
  });

  useEffect(()=>{
    loadUsers();
  },[]);

  const loadUsers=()=>{
    getUsers().then(res=>setUsers(res.data));
  };

  const save=()=>{

    if(saving) return;

    if(!form.name || !form.role){
      alert("Fill required fields");
      return;
    }

    if(form.role==="STUDENT" && !form.rollNo){
      alert("Student rollNo required");
      return;
    }

    if(form.role==="FACULTY" && !form.facultyId){
      alert("Faculty ID required");
      return;
    }

    setSaving(true);

    addUser({
      name:form.name,
      role:form.role,
      rollNo:form.role==="STUDENT"?form.rollNo:null,
      facultyId:form.role==="FACULTY"?form.facultyId:null
    })
    .then(()=>{
      alert("User added");

      setForm({
        name:"",
        role:"STUDENT",
        rollNo:"",
        facultyId:""
      });

      setRoleSearch("");
      loadUsers();
    })
    .finally(()=>setSaving(false));
  };

  const filteredRoles = ROLES.filter(r =>
  r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const totalPages = Math.ceil(users.length/perPage);
  const start = (page-1)*perPage;

  const paginatedUsers =
  users.slice(start,start+perPage);

  return(

    <div className="box">

      <h3>Add User</h3>

      <input
      placeholder="Name"
      value={form.name}
      onChange={e=>setForm({...form,name:e.target.value})}
      />

      <div className="dropdown">

        <input
        placeholder="Search role..."
        value={roleSearch}
        onFocus={()=>setShowRoles(true)}
        onChange={e=>{
          setRoleSearch(e.target.value);
          setShowRoles(true);
        }}
        />

        {showRoles && (

          <div className="dropdown-list">

            {filteredRoles.map(r=>(
              <div
              key={r}
              className="dropdown-item"
              onClick={()=>{
                setForm({...form,role:r});
                setRoleSearch(r);
                setShowRoles(false);
              }}
              >
              {r}
              </div>
            ))}

          </div>

        )}

      </div>

      {form.role==="STUDENT" && (

        <input
        placeholder="Roll No"
        value={form.rollNo}
        onChange={e=>setForm({...form,rollNo:e.target.value})}
        />

      )}

      {form.role==="FACULTY" && (

        <input
        placeholder="Faculty ID"
        value={form.facultyId}
        onChange={e=>setForm({...form,facultyId:e.target.value})}
        />

      )}

      <button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>

      <h3>Users List</h3>

      <div className="users-list">

        {paginatedUsers.map(u=>(

          <div key={u.userId} className="user-row">

            <div className="user-info">
              <span className="user-name">{u.name}</span>
              <span className="user-meta">
                {u.rollNo || u.facultyId}
              </span>
            </div>

            <span className={`user-role ${u.role.toLowerCase()}`}>
              {u.role}
            </span>

          </div>

        ))}

      </div>

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
  );
}