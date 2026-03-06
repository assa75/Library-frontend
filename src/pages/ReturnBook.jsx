import { useEffect,useState } from "react";
import { returnBook,getAllRecords,getBooks } from "../services/api";
import "./ReturnBook.css";

export default function ReturnBook() {

  const [records,setRecords] = useState([]);
  const [books,setBooks] = useState([]);

  const [search,setSearch] = useState("");
  const [show,setShow] = useState(false);
  const [selected,setSelected] = useState(null);

  const [message,setMessage] = useState("");
  const [type,setType] = useState(""); 

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async () => {
    const recRes = await getAllRecords();
    const bookRes = await getBooks();

    setRecords(recRes.data.filter(r=>!r.returnDate));
    setBooks(bookRes.data);
  };

  const filtered = records.filter(r =>
    String(r.accessNo).includes(search)
  );

  const bookDetails = selected
    ? books.find(b=>b.accessNo === selected.accessNo)
    : null;

  const handleReturn = async () => {
    try {
      const res = await returnBook(selected.accessNo);
      
      setMessage(res.data);
      setType("success");

      reset();
      loadData();

    } catch (e) {
      setMessage(e.response?.data || "Return failed");
      setType("error");
    }

    setTimeout(()=>{
      setMessage("");
      setType("");
    },3000);
  };

  const reset = () => {
    setSelected(null);
    setSearch("");
    setShow(false);
  };

  return (
    <div className="return-container">
      <h2>📥 Return Book</h2>

      {message && (
        <div className={`msg ${type}`}>{message}</div>
      )}


      <div className="dropdown">
        <input
          placeholder="Search Access No"
          value={search}
          onFocus={()=>setShow(true)}
          onChange={e=>{
            setSearch(e.target.value);
            setShow(true);
          }}
        />

        {show && (
          <div className="dropdown-list">
            {filtered.map(r=>(
              <div
                key={r.recordId}
                className="dropdown-item"
                onClick={()=>{
                  setSelected(r);
                  setSearch(r.accessNo);
                  setShow(false);
                }}
              >
                {r.accessNo}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="details">
          <p><b>Access No:</b> {selected.accessNo}</p>
          <p><b>Book Name:</b> {bookDetails?.bookName}</p>
          <p><b>Issued To:</b> {selected.role}</p>
          <p><b>User ID:</b> {selected.userId}</p>
          <p><b>Issue Date:</b> {selected.issueDate}</p>
          <p><b>Due Date:</b> {selected.dueDate}</p>

          {selected.fine > 0 && (
            <p className="fine">Fine: ₹{selected.fine}</p>
          )}

          <button onClick={handleReturn}>
            Return Book
          </button>
        </div>
      )}
    </div>
  );
}
