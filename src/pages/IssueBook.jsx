import { useEffect,useState } from "react";
import {
  issueBookToStudent,
  issueBookToFaculty,
  getUsers,
  getAvailableBooks
} from "../services/api";
import "./IssueBook.css";

export default function IssueBook() {

  const [users,setUsers] = useState([]);
  const [books,setBooks] = useState([]);

  const [message,setMessage] = useState("");
  const [msgType,setMsgType] = useState("");

  const [rollSearch,setRollSearch] = useState("");
  const [facultySearch,setFacultySearch] = useState("");
  const [studentBookSearch,setStudentBookSearch] = useState("");
  const [facultyBookSearch,setFacultyBookSearch] = useState("");

  const [rollNo,setRollNo] = useState("");
  const [facultyId,setFacultyId] = useState("");
  const [studentAccessNo,setStudentAccessNo] = useState("");
  const [facultyAccessNo,setFacultyAccessNo] = useState("");

  const [showRolls,setShowRolls] = useState(false);
  const [showFaculty,setShowFaculty] = useState(false);
  const [showBooksStudent,setShowBooksStudent] = useState(false);
  const [showBooksFaculty,setShowBooksFaculty] = useState(false);

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async () => {
    const usersRes = await getUsers();
    const booksRes = await getAvailableBooks();

    setUsers(usersRes.data);
    setBooks(booksRes.data);
  };

  const studentRolls = users.filter(u=>u.role==="STUDENT");
  const facultyIds = users.filter(u=>u.role==="FACULTY");

  const filteredStudentRolls = studentRolls.filter(s =>
    s.rollNo.toLowerCase().includes(rollSearch.toLowerCase())
  );

  const filteredFacultyIds = facultyIds.filter(f =>
    f.facultyId.toLowerCase().includes(facultySearch.toLowerCase())
  );

  const filteredStudentBooks = books.filter(b =>
    String(b.accessNo).includes(studentBookSearch)
  );

  const filteredFacultyBooks = books.filter(b =>
    String(b.accessNo).includes(facultyBookSearch)
  );

  const handleIssueStudent = async () => {
    try {
      const res = await issueBookToStudent(rollNo, studentAccessNo);
      showSuccess(res.data);
      resetStudent();
      loadData(); 
    } catch (err) {
      showError(err.response?.data || "Failed to issue book to student");
    }
  };

  const handleIssueFaculty = async () => {
    try {
      const res = await issueBookToFaculty(facultyId, facultyAccessNo);
      showSuccess(res.data);
      resetFaculty();
      loadData(); 
    } catch (err) {
      showError(err.response?.data || "Failed to issue book to faculty");
    }
  };


  const showSuccess = (msg) => {
    setMessage(msg);
    setMsgType("success");
    autoClear();
  };

  const showError = (msg) => {
    setMessage(msg);
    setMsgType("error");
    autoClear();
  };

  const autoClear = () => {
    setTimeout(()=>{
      setMessage("");
      setMsgType("");
    },3000);
  };


  const resetStudent = () => {
    setRollNo("");
    setRollSearch("");
    setStudentAccessNo("");
    setStudentBookSearch("");
    setShowRolls(false);
    setShowBooksStudent(false);
  };

  const resetFaculty = () => {
    setFacultyId("");
    setFacultySearch("");
    setFacultyAccessNo("");
    setFacultyBookSearch("");
    setShowFaculty(false);
    setShowBooksFaculty(false);
  };

  return (
    <div className="issue-container">
      <h2 className="issue-title">📘 Issue Book</h2>

      {message && (
        <div className={`issue-msg ${msgType}`}>
          {message}
        </div>
      )}

      <div className="issue-sections">

        <div className="issue-card student">
          <h4>Student</h4>

          <div className="dropdown">
            <input
              placeholder="Search Roll No"
              value={rollSearch}
              onFocus={()=>setShowRolls(true)}
              onChange={e=>{
                setRollSearch(e.target.value);
                setShowRolls(true);
              }}
            />
            {showRolls && (
              <div className="dropdown-list">
                {filteredStudentRolls.map(s=>(
                  <div
                    key={s.rollNo}
                    className="dropdown-item"
                    onClick={()=>{
                      setRollNo(s.rollNo);
                      setRollSearch(s.rollNo);
                      setShowRolls(false);
                    }}
                  >
                    {s.rollNo}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <input
              placeholder="Search Access No"
              value={studentBookSearch}
              onFocus={()=>setShowBooksStudent(true)}
              onChange={e=>{
                setStudentBookSearch(e.target.value);
                setShowBooksStudent(true);
              }}
            />
            {showBooksStudent && (
              <div className="dropdown-list">
                {filteredStudentBooks.map(b=>(
                  <div
                    key={b.accessNo}
                    className="dropdown-item"
                    onClick={()=>{
                      setStudentAccessNo(b.accessNo);
                      setStudentBookSearch(b.accessNo);
                      setShowBooksStudent(false);
                    }}
                  >
                    {b.accessNo} — {b.bookName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="issue-btn"
            disabled={!rollNo || !studentAccessNo}
            onClick={handleIssueStudent}
          >
            Issue to Student
          </button>
        </div>

        <div className="issue-card faculty">
          <h4>Faculty</h4>

          <div className="dropdown">
            <input
              placeholder="Search Faculty ID"
              value={facultySearch}
              onFocus={()=>setShowFaculty(true)}
              onChange={e=>{
                setFacultySearch(e.target.value);
                setShowFaculty(true);
              }}
            />
            {showFaculty && (
              <div className="dropdown-list">
                {filteredFacultyIds.map(f=>(
                  <div
                    key={f.facultyId}
                    className="dropdown-item"
                    onClick={()=>{
                      setFacultyId(f.facultyId);
                      setFacultySearch(f.facultyId);
                      setShowFaculty(false);
                    }}
                  >
                    {f.facultyId}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <input
              placeholder="Search Access No"
              value={facultyBookSearch}
              onFocus={()=>setShowBooksFaculty(true)}
              onChange={e=>{
                setFacultyBookSearch(e.target.value);
                setShowBooksFaculty(true);
              }}
            />
            {showBooksFaculty && (
              <div className="dropdown-list">
                {filteredFacultyBooks.map(b=>(
                  <div
                    key={b.accessNo}
                    className="dropdown-item"
                    onClick={()=>{
                      setFacultyAccessNo(b.accessNo);
                      setFacultyBookSearch(b.accessNo);
                      setShowBooksFaculty(false);
                    }}
                  >
                    {b.accessNo} — {b.bookName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="issue-btn"
            disabled={!facultyId || !facultyAccessNo}
            onClick={handleIssueFaculty}
          >
            Issue to Faculty
          </button>
        </div>

      </div>
    </div>
  );
}
