import axios from "axios";
import React, { useEffect, useState } from "react";
import token from "../modules/token";
import { isAuthenticated } from "../auth";
import { useNavigate } from "react-router-dom";
import FileCard from "../modules/components/fileCard";
import filter from "../modules/api/filter";

const ExtendedSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState([]);
  const [upvotedFilesList, setUpvotedFilesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }
    filter(params)
      .then((data) => {
        if (data == null) {
          alert("keine Ergbnisse gefunden");
        }
        const { searchResults, departmentFilter, semesterFilter, yearFilter } =
          data;
        setSearchResults(searchResults);
        setDepartmentFilter(departmentFilter);
        setSemesterFilter(semesterFilter);
        setYearFilter(yearFilter);
      })
      .catch((error) => {
        console.error("Es gab ein Problem beim Abrufen der filter:", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    

    filter(params)
      .then((data) => {
        setSearchResults(data.searchResults);
      })
      .catch((error) => {
        alert("keine passende Datei gefunden");
        console.error("Es gab ein Problem beim Abrufen der filter:", error);
      });
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
          <select
            className="form-select me-3"
            value={year}
            onChange={handleYearChange}
          >
            <option value="">Select Year</option>
            {yearFilter.map((yearOption, index) => (
              <option key={index} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>

          <select
            className="form-select me-3"
            value={semester}
            onChange={handleSemesterChange}
          >
            <option value="">Select Semester</option>
            {semesterFilter.map((semesterOption, index) => (
              <option key={index} value={semesterOption}>
                {semesterOption}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={department}
            onChange={handleDepartmentChange}
          >
            <option value="">Select Program</option>
            {departmentFilter.map((departmentOption, index) => (
              <option key={index} value={departmentOption}>
                {departmentOption}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Suche
        </button>
      </form>

      <FileCard initialFile={searchResults} />
    </div>
  );
};

export default ExtendedSearch;
