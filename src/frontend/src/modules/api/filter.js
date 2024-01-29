import axios from "axios";
import token from "../token";

const filter = async (params) => {
  return axios
    .get(`api/filter?${params.toString()}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => {
      if (response.data[1].length === 0) {
        return null;
      } else {
        return {
          searchResults: response.data[1],
          departmentFilter: response.data[0].departmentFilter,
          semesterFilter: response.data[0].semesterFilter,
          yearFilter: response.data[0].yearFilter,
        };
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

export default filter;
