import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Bitte füge eine Datei hinzu");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("semester", semester);
    formData.append("year", year);
    formData.append("department", department);
    formData.append("file", selectedFile);

    axios
      .post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Datei erfolgreich hochgeladen");
          navigate("/home");
        } else {
          alert("Etwas ist schief gelaufen. Bitte versuche es erneut");
        }
      })
      .catch((error) => {
        alert("Keine Verbindung zum Server");
        console.error("Fehler bei der API-Anfrage:", error);
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

        <p>Nur PDFs sind erlaubt</p>
        {fileName && <p>Datei: {fileName}</p>}

        <div className="mb-3">
          <label className="btn btn-primary">
            Datei auswählen
            <input
              type="file"
              className="form-control-file"
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: "none" }}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Hochladen
        </button>
      </form>
    </div>
  );
};

export default Upload;
