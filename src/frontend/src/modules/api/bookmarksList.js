import axios from "axios";
import token from "../token";

const bookmarksList = async () => {
  try {
    const response = await axios.get("api/bookmarks", {
      headers: {
        Authorization: `${token}`,
      },
    });

    // Extrahiere die Werte (Buchzeichen) aus dem Antwortobjekt und gebe sie direkt zurück
    return Object.values(response.data);
  } catch (error) {
    console.error("Es gab ein Problem mit der API-Abfrage", error);
    return []; // Im Falle eines Fehlers geben Sie ein leeres Array zurück.
  }
};

export default bookmarksList;
