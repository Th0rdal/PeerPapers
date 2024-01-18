import axios from "axios";
import React, { useState } from "react";
import { saveAs } from "file-saver";

const ExtendedSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");

  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (author) params.append("author", author);
  if (year) params.append("year", year);
  if (semester) params.append("semester", semester);
  if (department) params.append("department", department);
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get(`api/filter?${params.toString()}`)
      .then((response) => {
        if (response.data[1].length === 0) {
          alert("keine passende Datei gefunden");
        } else {
          setSearchResults(response.data[1]); // Annahme, dass die Daten im zweiten Element sind
        }
        // Verarbeiten der Antwort
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error("Error fetching data:", error);
      });
    // Perform search with title, author, year, semester, and department
    console.log("Searching with", params.toString());
  };

  const download = (id) => {
    // Zeigt ein Bestätigungsfenster an
    if (window.confirm("Möchten Sie die Datei wirklich herunterladen?")) {
      axios
        .get(`api/download?id=${id}`, { responseType: "blob" })
        .then((response) => {
          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          saveAs(pdfBlob, `${title}.pdf`); // Speichert die Datei als PDF
        })
        .catch((error) => {
          console.error("Fehler beim Herunterladen der Datei:", error);
        });
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="text-center">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title..."
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Author..."
            value={author}
            onChange={handleAuthorChange}
          />
        </div>

        <div className="mb-3 d-flex justify-content-start align-items-center">
          <div className="me-3">
            <input
              type="number"
              className="form-control"
              placeholder="Year..."
              value={year}
              onChange={handleYearChange}
            />
          </div>

          <select
            className="form-select me-3"
            value={semester}
            onChange={handleSemesterChange}
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

          <select
            className="form-select"
            value={department}
            onChange={handleDepartmentChange}
          >
            <option value="">Select Program</option>
            <option value="Molekulare Biotechnologie">
              Molekulare Biotechnologie
            </option>
            <option value="Computer Science and Digital Communications">
              Computer Science and Digital Communications
            </option>
            <option value="Architektur - Green Building">
              Architektur - Green Building
            </option>
            <option value="Public Management">Public Management</option>
            <option value="Orthoptik">Orthoptik</option>
            <option value="Gesundheits- und Krankenpflege">
              Gesundheits- und Krankenpflege
            </option>
            <option value="Soziale Arbeit">Soziale Arbeit</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Suche
        </button>
      </form>

      <div className="row">
        {searchResults.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">Author: {item.author}</p>
                <p className="card-text">Semester: {item.semester}</p>
                <p className="card-text">Year: {item.year}</p>
                <p className="card-text">Department: {item.department}</p>
                <p className="card-text">Upvotes: {item.upvotes}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => download(item.id)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtendedSearch;
