import React, { useState } from "react";

const ExtendedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [author, setAuthor] = useState("");
  const [filters, setFilters] = useState({
    filter1: "", // Changed to a string to store the selected year
    filter2: "", // Changed to a string to store the selected semester
    filter3: "", // Changed to a string to store the selected program
    // Add more filters as needed
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Validate numeric input for "Filter 1" (Year)
    if (name === "filter1" && isNaN(value)) {
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform search with searchTerm, author, and filters
    console.log("Searching with", searchTerm, author, filters);
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
          <div className="form-check form-check-inline text-start">
            <input
              className="form-control"
              type="text"
              name="filter1"
              id="filter1"
              value={filters.filter1}
              onChange={handleFilterChange}
              onKeyDown={(e) => !/\d/.test(e.key) && e.preventDefault()} // Allow only numeric keys
              placeholder="Year"
            />
          </div>

          {/* Dropdown for "Filter 2" */}
          <div className="form-check form-check-inline text-start">
            <select
              className="form-select"
              name="filter2"
              id="filter2"
              value={filters.filter2}
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
              value={filters.filter3}
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
