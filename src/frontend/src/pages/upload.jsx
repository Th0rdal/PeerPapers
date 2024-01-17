import React, { useState } from "react";

const Upload = () => {
  const [author, setAuthor] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // Zustand für den Dateinamen

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
    // Verwende die ausgewählte Datei (selectedFile) für den Upload
    if (selectedFile) {
      console.log("Ausgewählte Datei:", selectedFile);
      // Hier kannst du die Datei an das Backend senden oder weitere Aktionen ausführen
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="text-center">
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
