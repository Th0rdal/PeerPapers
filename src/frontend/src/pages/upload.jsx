import React, { useState } from "react";

const Upload = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [author, setAuthor] = useState("");
  const [filters, setFilters] = useState({
    filter1: false,
    filter2: false,
    // Add more filters as needed
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
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
            placeholder="Titel..."
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

        <div className="form-check mb-3 text-start">
          <input
            className="form-check-input"
            type="checkbox"
            name="filter1"
            id="filter1"
            checked={filters.filter1}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="filter1">
            Filter 1
          </label>
        </div>

        <div className="form-check mb-3 text-start">
          <input
            className="form-check-input"
            type="checkbox"
            name="filter2"
            id="filter2"
            checked={filters.filter2}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="filter2">
            Filter 2
          </label>
        </div>

        {/* Add more filters as needed */}

        <button type="submit" className="btn btn-primary">
          Upoload
        </button>
      </form>
    </div>
  );
};

export default Upload;
