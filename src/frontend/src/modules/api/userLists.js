import axios from "axios";
import token from "../token";

const userLists = async () => {
  return axios
    .get(`api/userLists`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => {
      return {
        bookmarks: response.data.bookmarks,
        upvotedFiles: response.data.upvotedFiles,
      };
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

export default userLists;
