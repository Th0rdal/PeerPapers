import React, { useEffect, useState } from "react";
import axios from "axios";
import token from "../modules/token";
import { isAuthenticated } from "../auth";

const Rangliste = () => {
  const [rankData, setRankData] = useState([]);

  useEffect(() => {
    if (isAuthenticated() === false) {
      navigate("/");
    }
    axios
      .get("api/rankList", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRankData(response.data);
        } else {
          console.error("Ungültige Antwortstruktur:", response.data);
        }
      })
      .catch((error) => {
        console.error("Es gab ein Problem mit der API-Abfrage", error);
      });
  }, []);

  const renderRankCards = () => {
    return rankData.map((data, index) => (
      <div key={index} className="col-md-6 mb-3">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Username: {data.username}</h5>
            <p className="card-text">Rangpunkte: {data.rankPoints}</p>
            <p className="card-text">Rang: {data.rank}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      <h1>Rangliste</h1>
      <p>Top 100 User</p>
      <div className="row">
        {rankData.length === 0 ? (
          <p>Es wurden keine Rangdaten gefunden.</p>
        ) : (
          renderRankCards()
        )}
      </div>
    </div>
  );
};

export default Rangliste;
