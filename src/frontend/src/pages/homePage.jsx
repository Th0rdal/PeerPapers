import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const HomePage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkAdded, setBookmarkAdded] = useState(false); // Zustand für die Aktualisierung
  const [upvoteAdded, setUpvoteAdded] = useState(false);
  const [downloadBool, setDownloadBool] = useState(false);

  const token = Cookies.get("token");
  useEffect(() => {
    axios
      .get("api/bookmarks", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        // Überprüfen, ob response.data ein Array ist und mindestens 2 Elemente enthält
        if (Array.isArray(response.data) && response.data.length > 1) {
          // Die eigentlichen Daten befinden sich im Objekt an der zweiten Stelle des Arrays
          const data = response.data[1];
          // Umwandeln des Objekts in ein Array von Werten
          const bookmarksArray = Object.values(data);
          setBookmarks(bookmarksArray);
        } else {
          console.error("Ungültige Antwortstruktur:", response.data);
        }
      })
      .catch((error) => {
        console.error("Es gab ein Problem mit der API-Abfrage", error);
      });
  }, [bookmarkAdded, upvoteAdded, downloadBool]);

  // Funktionen für die Buttons (diese müssen noch implementiert werden)
  const download = (id, title) => {
    // Zeigt ein Bestätigungsfenster an
    if (window.confirm("Möchten Sie die Datei wirklich herunterladen?")) {
      axios
        .get(`api/download?id=${id}`, {
          responseType: "blob",
          headers: {
            Authorization: `${token}`, // Bearer-Token aus dem Cookie holen
          },
        })
        .then((response) => {
          const pdfBlob = new Blob([response.data], {
            type: "application/pdf",
          });
          setDownloadBool(!downloadBool);
          saveAs(pdfBlob, `${title}.pdf`); // Speichert die Datei als PDF
        })
        .catch((error) => {
          console.error("Fehler beim Herunterladen der Datei:", error);
        });
    }
  };

  const bookmark = (id) => {
    console.log("token: " + token);
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
          setBookmarkAdded(!bookmarkAdded);
        }
      })
      .catch((error) => {
        alert("Server Fehler");
        console.error("Fehler beim bookmarken der Datei:", error);
      });
  };

  const upvote = (id) => {
    axios
      .put(
        "api/upvote",
        { fileID: id },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUpvoteAdded(!upvoteAdded);
        }
      })
      .catch((error) => {
        alert("Server Fehler");
        console.error("Fehler beim bookmarken der Datei:", error);
      });
    console.log(`Upvote ID ${id}`);
  };

  return (
    <div className="row">
      <h1>Bookmarked Files</h1>
      {bookmarks.length === 0 ? (
        <p>Es wurden noch keine Dateien gebookmarked.</p>
      ) : (
        bookmarks.map((item, index) => (
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
                      Bookmark
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => upvote(item.id)}
                    >
                      Upvote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
