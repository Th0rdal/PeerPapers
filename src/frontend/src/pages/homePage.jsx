import React, { useState } from "react";
import pdf from "../assets/testFetchPdf.json";

const HomePage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [bookMarkedFiles, setBookMarkedFiles] = useState([]);

  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (author) params.append("author", author);
  if (year) params.append("year", year);
  if (semester) params.append("semester", semester);
  if (department) params.append("department", department);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const download = async () => {
    console.log("test");
  };

  const pdfData = pdf.map((item, index) => (
    <div key={index} className="col-md-6 mb-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{item.titel}</h5>
          <p className="card-text">Author: {item.author}</p>
          <p className="card-text">Semester: {item.semester}</p>
          <p className="card-text">Year: {item.year}</p>
          <p className="card-text">Department: {item.department}</p>
          <p className="card-text">Upvotes: {item.upvotes}</p>
          <button className="btn btn-primary" onClick={download}>
            download
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container my-4">
      <h1>Book Marked</h1>
      <div className="row">
        {bookMarkedFiles.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">Author: {item.author}</p>
                <p className="card-text">Semester: {item.semester}</p>
                <p className="card-text">Year: {item.year}</p>
                <p className="card-text">Department: {item.department}</p>
                <p className="card-text">Upvotes: {item.upvotes}</p>

                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => download(item.id)}
                    >
                      Download
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => bookmark(item.id)}
                    >
                      Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
