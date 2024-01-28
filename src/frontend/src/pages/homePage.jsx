import React, { useEffect, useState } from "react";
import axios from "axios";
import token from "../modules/token";
import { isAuthenticated } from "../auth";
import FileCard from "../modules/components/fileCard";
import bookmarksList from "../modules/api/bookmarksList";

const HomePage = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }

    bookmarksList()
      .then((data) => {
        setBookmarks(data);
      })
      .catch((error) => {
        console.error("Es gab ein Problem beim Abrufen der Bookmarks:", error);
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
