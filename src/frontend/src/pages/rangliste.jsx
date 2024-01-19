import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Rangliste = () => {
  const [rankList, setRanklist] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get(`api/rankList`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        // Überprüfen Sie die Datenstruktur der Antwort
        if (response.data && response.data.length > 0) {
          setRanklist(response.data);
        } else {
          alert("Keine Daten in der Rangliste gefunden");
        }
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <main>
        <h1>Rangliste</h1>
        <p>Hier werden die Top-User in einer Rangliste angezeigt</p>
        <div className="row">
          {Array.isArray(rankList) ? (
            rankList.map((item, index) => (
              // Hier Ihren Code für das Mapping der Liste einfügen
              <div key={index} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-text">Name: {item.name}</h5>
                    <p className="card-text">Rang: {item.rang}</p>
                    <p className="card-text">Rangpunkte: {item.rankPoints}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Server Fehler</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Rangliste;
