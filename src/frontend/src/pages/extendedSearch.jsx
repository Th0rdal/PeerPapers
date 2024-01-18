import React, { useState } from "react";

const ExtendedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [author, setAuthor] = useState("");
  const [filters, setFilters] = useState({
    year: "", // Changed to a string to store the selected year
    semester: "", // Changed to a string to store the selected semester
    department: "", // Changed to a string to store the selected program
    // Add more filters as needed
  });

  const [filter1Error, setFilter1Error] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Validate numeric input for "Filter 1" (Year)
    if (name === "filter1") {
      if (!/^\d{4}$/.test(value)) {
        setFilter1Error("Year must be a 4-digit number");
      } else {
        setFilter1Error("");
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //const handleSubmit = (event) => {
    //event.preventDefault();

    // Perform search with searchTerm, author, and filters
    //console.log("Searching with", searchTerm, author, filters);
  //};

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate filters or handle any other validation logic if needed
    if (filter1Error) {
      // Handle invalid filter state
      return;
    }
  
    // Prepare the search query object
    const searchQuery = {
      searchTerm: searchTerm,
      author: author,
      filter1: filters.year,
      filter2: filters.semester,
      filter3: filters.department,
    };
  
    // Convert the searchQuery object to URL parameters
    const queryParams = new URLSearchParams(searchQuery).toString();
  
    try {
      // Send the search request to the backend using GET method
      const response = await fetch(`/api/filter?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (response.status == 200) {
        alert("Filter applied");
      }
      const jsonData = await response.json();
      console.log("Search results:", jsonData);
      // Handle the search results as needed
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors or display an error message to the user
    }
    console.log("Search results:", jsonData.message);
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="text-center">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Author..."
            value={author}
            onChange={handleAuthorChange}
          />
        </div>

        <div className="mb-3 d-flex justify-content-start align-items-center">
          {/* Use an input field for "Year" */}
          <div className="form-check form-check-inline text-start" style={{ height: "2.5rem" }}>
            <input
              className={`form-control ${filter1Error ? "is-invalid" : ""}`}
              type="text"
              name="year"
              id="year"
              value={filters.year}
              onChange={handleFilterChange}
              onKeyDown={(e) => {
                if (!(e.key === "Backspace" || /^\d$/.test(e.key))) {
                  e.preventDefault();
                }
              }}
              placeholder="Year"
            />
            {filter1Error && (
              <div className="invalid-feedback">{filter1Error}</div>
            )}
          </div>

          {/* Dropdown for "Filter 2" */}
          <div className="form-check form-check-inline text-start">
            <select
              className="form-select"
              name="semester"
              id="semester"
              value={filters.semester}
              onChange={handleFilterChange}
            >
              <option value="">Select Semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
            </select>
          </div>

          {/* Dropdown for "Filter 3" */}
          <div className="form-check form-check-inline text-start">
            <select
              className="form-select"
              name="filter3"
              id="filter3"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">Select Program</option>
              <option value="Molekulare Biotechnologie">Molekulare Biotechnologie</option>
              <option value="Computer Science and Digital Communications">Computer Science and Digital Communications</option>
              <option value="Architektur – Green Building">Architektur – Green Building</option>
              <option value="Public Management">Public Management</option>
              <option value="Orthoptik">Orthoptik</option>
              <option value="Gesundheits- und Krankenpflege">Gesundheits- und Krankenpflege</option>
              <option value="Soziale Arbeit">Soziale Arbeit</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtendedSearch;
