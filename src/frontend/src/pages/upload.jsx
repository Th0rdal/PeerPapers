import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import token from "../modules/token";
import { jwtDecode } from "jwt-decode";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // JWT aus dem Cookie holen und den Benutzernamen extrahieren
    const jwtFromCookie = token; // Passe dies entsprechend deiner Cookie-Struktur an

    if (jwtFromCookie) {
      const decodedToken = jwtDecode(jwtFromCookie);
      const usernameFromJWT = decodedToken.username; // Stelle sicher, dass dies dem Schlüssel in deinem JWT entspricht

      setAuthor(usernameFromJWT);
    }
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    const regex =
      /^(200[0-9]|20[1-9][0-9]|2[1-9][0-9]{2}|[3-9][0-9]{3}|[1-9][0-9]{4})$/;

    const currentYear = new Date().getFullYear();
    const inputYear = event.target.value;

    if (regex.test(inputYear) || inputYear === "") {
      // Wenn die Eingabe den Anforderungen entspricht oder leer ist, setze das Jahr
      setYear(inputYear);
    } else {
      // Andernfalls setze das Jahr auf das aktuelle Jahr
      setYear(currentYear.toString());
    }
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
        }
      })
      .catch((error) => {
        alert(error.response.data.error);
        console.log("Fehler bei der API-Anfrage:", error.response.data.error);
      });
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="text-center">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            required
            placeholder="Title..."
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="mb-3 d-flex justify-content-start align-items-center">
          <div className="me-3">
            <input
              type="number"
              className="form-control"
              required
              placeholder="Jahr..."
              value={year}
              onBlur={handleYearChange}
              onChange={(event) => setYear(event.target.value)}
            />
          </div>

          <select
            className="form-select me-3"
            value={semester}
            onChange={handleSemesterChange}
            required
          >
            <option value="">Semester Auswählen</option>
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
            required
          >
            <option value="">Studiengang Auswählen</option>
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
