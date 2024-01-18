import axios from "axios";
import React, { useState } from "react";

const ExtendedSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");

  const params = new URLSearchParams({
    title,
    author,
    year,
    semester,
    department,
  }).toString();

  const handleSearchChange = (event) => {
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
      .get(`api/filter?${params}`)
      .then((response) => {
        // Verarbeiten der Antwort
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error("Error fetching data:", error);
      });
    // Perform search with title, author, year, semester, and department
    console.log("Searching with", params);
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
            onChange={handleSearchChange}
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

        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Year..."
            value={year}
            onChange={handleYearChange}
          />
        </div>

        <div className="form-check form-check-inline text-start">
          <select
            className="form-select"
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
        </div>

        <div className="form-check form-check-inline text-start">
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

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtendedSearch;
