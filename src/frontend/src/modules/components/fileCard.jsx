import axios from "axios";
import React, { useEffect, useState } from "react";
import token from "../token";
import { isAuthenticated } from "../../auth";
import { useNavigate } from "react-router-dom";
import download from "../api/download";
import bookmark from "../api/bookmark";
import userLists from "../api/userLists";

const FileCard = ({ initialFile }) => {
  const [upvoteAdded, setUpvoteAdded] = useState(false);
  const [bookmarks, setBookmarks] = useState({});
  const [upvotedFilesList, setUpvotedFilesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);

  // get Cookie
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }

    userLists()
      .then((response) => {
        // Setze die Bookmarks und UpvotedFiles, wenn die Promise aufgelöst ist
        setBookmarksList(response.bookmarks);
        setUpvotedFilesList(response.upvotedFiles);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerlisten:", error);
      });
  }, [upvoteAdded, bookmarks]);

  const handleBookmark = async (id) => {
    try {
      const updatedId = await bookmark(id);
      // Aktualisiere die bookmarks mit der zurückgegebenen ID
      setBookmarks((prev) => ({ ...prev, [updatedId]: !prev[updatedId] }));
    } catch (error) {
      alert(error.message);
      console.error("Fehler beim bookmarken der Datei:", error);
    }
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
                      onClick={async () => await download(item.id, item.title)}
                    >
                      Download
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={async () => await handleBookmark(item.id)}
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
