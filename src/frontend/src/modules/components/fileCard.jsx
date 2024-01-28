import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import { isAuthenticated } from "../../auth";
import { useNavigate } from "react-router-dom";

const FileCard = ({ initialFile }) => {
  const [file, setFile] = useState(initialFile);
  const [upvoteAdded, setUpvoteAdded] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [downloadBool, setDownloadBool] = useState(false);
  const [upvotedFilesList, setUpvotedFilesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);

  // get Cookie
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }
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
          // Entferne die betroffene Datei aus der file-Liste
          const updatedFileList = file.filter((item) => item.id !== id);
          // Aktualisiere die file-Props
          setFile(updatedFileList);
          // Aktualisiere die bookmarks
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
      <div className="row">
        {initialFile.map((item, index) => (
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

export default FileCard;
