import axios from "axios";
import token from "../token";

const bookmark = async (id) => {
  try {
    const response = await axios.put(
      `api/bookmark`,
      { fileID: id },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      return id; // Gibt die ID der aktualisierten Datei zurück
    } else {
      throw new Error("Server Error");
    }
  } catch (error) {
    throw new Error("Server Fehler");
  }
};

export default bookmark;