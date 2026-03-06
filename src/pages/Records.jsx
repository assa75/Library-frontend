import { useEffect,useState } from "react";
import { getAllRecords,payFine } from "../services/api";
import "./Records.css";

export default function Records(){

  const [records,setRecords] = useState([]);
  const [paying,setPaying] = useState({});
  const [search,setSearch] = useState("");

  const [page,setPage] = useState(1);
  const perPage = 10;

  useEffect(()=>{
    loadRecords();
  },[]);

  const loadRecords = ()=>{
    getAllRecords().then(res=>setRecords(res.data));
  };

  const getRecordStatus = (r)=>{
    if(!r.returnDate) return "ISSUED";
    if(r.fine>0) return "OVERDUE";
    return "RETURNED";
  };

  const getFineStatus = (r)=>{
    if(r.fine>0 && r.fineStatus!=="PAID") return "UNPAID";
    if(r.fine>0 && r.fineStatus==="PAID") return "PAID";
    return "-";
  };

  const totalCollected = records
  .filter(r=>r.fine>0 && r.fineStatus==="PAID")
  .reduce((sum,r)=>sum+r.fine,0);

  const totalUnpaid = records
  .filter(r=>r.fine>0 && r.fineStatus!=="PAID")
  .reduce((sum,r)=>sum+r.fine,0);

  const totalFine = totalCollected + totalUnpaid;

  const handlePay=(recordId)=>{

    if(paying[recordId]) return;

    setPaying(prev=>({...prev,[recordId]:true}));

    payFine(recordId)
    .then(()=>{
      alert("Fine paid");
      loadRecords();
    })
    .catch(()=>alert("Payment failed"))
    .finally(()=>{
      setPaying(prev=>({...prev,[recordId]:false}));
    });
  };

  const filteredRecords = records.filter(r=>{
    const text = search.toLowerCase();

    return(
      String(r.recordId).includes(text) ||
      String(r.memberId).toLowerCase().includes(text) ||
      String(r.accessNo).includes(text) ||
      (r.role && r.role.toLowerCase().includes(text)) ||
      (r.issueDate && r.issueDate.includes(text)) ||
      (r.dueDate && r.dueDate.includes(text)) ||
      (r.returnDate && r.returnDate.includes(text)) ||
      getRecordStatus(r).toLowerCase().includes(text) ||
      (r.fineStatus && r.fineStatus.toLowerCase().includes(text))
    );
  });

  const totalPages = Math.ceil(filteredRecords.length/perPage);
  const start = (page-1)*perPage;

  const paginatedRecords =
  filteredRecords.slice(start,start+perPage);

  return(

    <div className="records-container">

      <div className="fine-summary">

        <div className="fine-card paid">
          <h4>Fine Collected</h4>
          <p>₹{totalCollected}</p>
        </div>

        <div className="fine-card unpaid">
          <h4>Fine Pending</h4>
          <p>₹{totalUnpaid}</p>
        </div>

        <div className="fine-card total">
          <h4>Total Fine</h4>
          <p>₹{totalFine}</p>
        </div>

      </div>

      <div className="records-search">

        <input
        placeholder="Search by member id,access no..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
        />

      </div>

      <table className="records-table">

        <thead>

          <tr>
            <th>Record ID</th>
            <th>Member ID</th>
            <th>Role</th>
            <th>Access No</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Fine</th>
            <th>Fine Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {paginatedRecords.length===0 ? (

            <tr>
              <td colSpan="11" style={{textAlign:"center"}}>
              No records found
              </td>
            </tr>

          ) : (

            paginatedRecords.map(r=>(
              <tr key={r.recordId}>

                <td>{r.recordId}</td>
                <td>{r.memberId}</td>
                <td>{r.role}</td>
                <td>{r.accessNo}</td>
                <td>{r.issueDate}</td>
                <td>{r.dueDate}</td>
                <td>{r.returnDate || "-"}</td>

                <td
                className={
                  getRecordStatus(r)==="ISSUED"
                  ? "status-issued"
                  : getRecordStatus(r)==="RETURNED"
                  ? "status-returned"
                  : "status-overdue"
                }
                >
                {getRecordStatus(r)}
                </td>

                <td>₹{r.fine}</td>

                <td>{getFineStatus(r)}</td>

                <td>

                  {getFineStatus(r)==="UNPAID" && (

                    <button
                    className="pay-btn"
                    onClick={()=>handlePay(r.recordId)}
                    disabled={paying[r.recordId]}
                    >
                    {paying[r.recordId] ? "Paying..." : "Pay"}
                    </button>

                  )}

                  {getFineStatus(r)==="PAID" && (
                    <span className="paid-text">PAID</span>
                  )}

                </td>

              </tr>
            ))

          )}

        </tbody>

      </table>

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