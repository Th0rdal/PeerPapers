import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const token = Cookies.get("token"); // Ändere den Zugriff auf das Cookie

  // console.log("token from cookie: " + Cookies.get("token")); // Ausgabe des Tokens aus dem Cookie

  if (!token) {
    // console.log("token fehlt");
    return false;
  }

  // Entferne den Präfix "Bearer " aus dem Token
  const tokenWithoutBearer = token.replace("Bearer ", "");
  // console.log("token ohne baerer: " + tokenWithoutBearer);

  try {
    const decodedToken = jwtDecode(tokenWithoutBearer);
    // console.log("Decoded Token:", decodedToken);
    // Check if the token has expired
    const currentTime = Date.now() / 1000; // Current time in seconds
    // console.log("expiration time: " + decodedToken.exp);
    // console.log("datenow " + Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // console.log("Token ist abgelaufen");
      return false; // Token has expired
    }
    // console.log("juhu token passt");
    return true; // Token is valid
  } catch (error) {
    // console.log("Fehler beim Dekodieren des Tokens:", error.message);
    // Handle any errors while decoding the token (e.g., invalid token format)
    return false;
  }
};
