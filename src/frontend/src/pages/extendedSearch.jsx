import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import { isAuthenticated } from "../auth";
import { useNavigate } from "react-router-dom";

const ExtendedSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [upvoteAdded, setUpvoteAdded] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState([]);
  const [downloadBool, setDownloadBool] = useState(false);
  const [upvotedFilesList, setUpvotedFilesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);
  const token = Cookies.get("token");
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
    axios
      .get(`api/filter?${params.toString()}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.data[1].length === 0) {
          alert("keine passende Datei gefunden");
        } else {
          setSearchResults(response.data[1]);
          setDepartmentFilter(response.data[0].departmentFilter);
          setSemesterFilter(response.data[0].semesterFilter);
          setYearFilter(response.data[0].yearFilter);
        }
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get(`api/userLists`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setBookmarksList(response.data.bookmarks);
        setUpvotedFilesList(response.data.upvotedFiles);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [upvoteAdded, bookmarks, downloadBool]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("token: " + token);

    axios
      .get(`api/filter?${params.toString()}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.data[1].length === 0) {
          alert("keine passende Datei gefunden");
        } else {
          setSearchResults(response.data[1]);
        }
        console.log("BookmarksList:", bookmarksList);
        console.log("upvotedList:", upvotedFilesList);
        console.log("Response:", response.data);
        console.log("department:", departmentFilter);
        console.log("semseter:", semesterFilter);
        console.log("year:", yearFilter);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    console.log("Searching with", params.toString());
  };

  const download = (id, title) => {
    if (window.confirm("Möchten Sie die Datei wirklich herunterladen?")) {
      axios
        .get(`api/download?id=${id}`, {
          responseType: "blob",
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          setDownloadBool(!downloadBool);
          saveAs(pdfBlob, `${title}.pdf`);
        })
        .catch((error) => {
          console.error("Fehler beim Herunterladen der Datei:", error);
        });
    }
  };

  const bookmark = (id) => {
    axios
      .put(
        `api/bookmark`,
        { fileID: id },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
        } else alert("server Error");
      })
      .catch((error) => {
        alert("Server Fehler");
        console.error("Fehler beim bookmarken der Datei:", error);
      });
  };

  const upvote = (id) => {
    axios
      .put(`api/upvote?fileID=${id}`, null, {
        // Den Request-Body auf null setzen
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("upvote 1" + upvoteAdded);
          setUpvoteAdded(!upvoteAdded);
          console.log("upvote 2" + upvoteAdded);
        }
      })
      .catch((error) => {
        console.log("isAuthenciated value: " + isAuthenticated());
        if (isAuthenticated() === false) {
          navigate("/");
        }
        alert("Server Fehler");
        console.error("Fehler beim upvoten der Datei:", error);
      });
    console.log(`Upvote ID ${id}`);
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

      <div className="row">
        {searchResults.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">Autor: {item.author}</p>
                <p className="card-text">Semester: {item.semester}</p>
                <p className="card-text">Jahr: {item.year}</p>
                <p className="card-text">Studiengang: {item.department}</p>
                <p className="card-text">Upvotes: {item.upvotes}</p>
                <p className="card-text">Gesamt Downloads: {item.downloads}</p>

                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => download(item.id, item.title)}
                    >
                      Download
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => bookmark(item.id)}
                    >
                      {bookmarksList.includes(item.id)
                        ? "Bookmark aufheben"
                        : "Bookmark"}
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className={`btn ${
                        upvotedFilesList.includes(item.id)
                          ? "btn-success"
                          : "btn-primary"
                      }`}
                      onClick={() => upvote(item.id)}
                    >
                      upvote
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

export default ExtendedSearch;
