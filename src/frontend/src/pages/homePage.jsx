import React from "react";
import pdf from "../assets/testFetchPdf.json";

const HomePage = () => {
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
    <div className="container mt-5">
      <div className="row">{pdfData}</div>
    </div>
  );
};

export default HomePage;
