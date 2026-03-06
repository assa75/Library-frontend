import { useEffect, useState } from "react";
import { getBooks, addBook } from "../services/api";
import "./Books.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const [count, setCount] = useState("");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState(""); 

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Error loading books", err);
    }
  };

  const handleAdd = async () => {
    if (!bookName || !count) {
      setMsg("Please enter book name and count");
      return;
    }

    await addBook(bookName, count);

    setMsg("Books added successfully");
    setBookName("");
    setCount("");
    setSearch("");
    loadBooks();
  };

  const filteredBooks = books.filter(b =>
    b.bookName.toLowerCase().includes(search.toLowerCase()) ||
    String(b.accessNo).includes(search)
  );

  return (
    <div className="books">
      <h2>Books</h2>

      <div className="book-form">
        <input
          type="text"
          placeholder="Book Title"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />

        <button onClick={handleAdd}>Add Books</button>
      </div>

      {msg && <p className="msg">{msg}</p>}

      <div className="book-search">
        <input
          type="text"
          placeholder="Search by book name or access no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table-wrapper">
        <thead>
          <tr>
            <th>Access No</th>
            <th>Book Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.length === 0 ? (
            <tr>
              <td colSpan="3">No books found</td>
            </tr>
          ) : (
            filteredBooks.map((b) => (
              <tr key={b.accessNo}>
                <td>{b.accessNo}</td>
                <td>{b.bookName}</td>
                <td className={b.status}>{b.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
