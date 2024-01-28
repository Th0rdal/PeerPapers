import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { isAuthenticated } from "../auth";
import FileCard from "../modules/components/fileCard";

const HomePage = () => {
  const [bookmarks, setBookmarks] = useState([]);

  const token = Cookies.get("token");
  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }
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
  }, [bookmarks]);

  return (
    <div className="row">
      <h1>Bookmarked Files</h1>
      {bookmarks.length === 0 ? (
        <p>Es wurden noch keine Dateien gebookmarked.</p>
      ) : (
        <FileCard initialFile={bookmarks} />
      )}
    </div>
  );
};

export default HomePage;
