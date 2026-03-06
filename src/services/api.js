import axios from "axios";

const API = axios.create({
  baseURL: "https://library-ipzd.onrender.com"
});

export const getUsers = () => API.get("/users/all");

export const addUser = (data) => API.post("/users/add", data);

export const addUsers = (data) => API.post("/users/multiple", data);


export const getBooks = () => API.get("/books/all");

export const addBook = (bookName, count) =>
  API.post(`/books/add?bookName=${bookName}&count=${count}`);

export const getAvailableBooks = () => API.get("/books/available");

// issue to student
export const issueBookToStudent = (rollNo,accessNo) =>
  API.post(`/library/issue/student?rollNo=${rollNo}&accessNo=${accessNo}`);

// issue to faculty
export const issueBookToFaculty = (facultyId,accessNo) =>
  API.post(`/library/issue/faculty?facultyId=${facultyId}&accessNo=${accessNo}`);

export const returnBook = (accessNo) =>
  API.post(`/library/return?accessNo=${accessNo}`);


export const getAllRecords = () => API.get("/library/all");

export const payFine = (recordId) =>
  API.put(`/library/payfine/${recordId}`);