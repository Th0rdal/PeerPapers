import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // Zustand für den Dateinamen

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

    if (file) {
      setFileName(file.name); // Speichere den Dateinamen im Zustand
    } else {
      setFileName(""); // Lösche den Dateinamen, falls keine Datei ausgewählt ist
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Du musst eine Datei hinzufügen");
      return;
    }

    // Erstelle ein FormData-Objekt, um die Daten zu senden
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("semester", semester);
    formData.append("year", year);
    formData.append("department", department);
    formData.append("file", selectedFile);

    // Sende die POST-Anfrage mit Axios
    axios
      .post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Setze den Header für FormData
        },
      })
      .then((response) => {
        // Hier kannst du auf die Antwort des Servers reagieren, z.B. Erfolgsmeldungen anzeigen
        console.log("Antwort vom Server:", response.data);
      })
      .catch((error) => {
        // Bei einem Fehler wird dieser Block ausgeführt
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
            placeholder="Titel..."
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

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Semester..."
            value={semester}
            onChange={handleSemesterChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Year..."
            value={year}
            onChange={handleYearChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Department..."
            value={department}
            onChange={handleDepartmentChange}
          />
        </div>

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
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
