import axios from "axios";
import token from "../token";
import { saveAs } from "file-saver";

const download = async (id, title) => {
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
        saveAs(pdfBlob, `${title}.pdf`);
      })
      .catch((error) => {
        console.error("Fehler beim Herunterladen der Datei:", error);
      });
  }
};

export default download;
