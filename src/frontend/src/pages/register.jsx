import styles from "../styles/ContactForm.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const contact = {
    username: email,
    password: password,
  };

  const login = async (e) => {
    const response = await fetch("api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    const data = await response.json();

    if (response.status === 200) {
      Cookies.set("token", data.token);
      alert("Login erfolgreich");
      navigate("/home");
      console.log("Navigating to /home...");
    } else if (response.status === 401 || response.status === 400) {
      alert("Falscher Benutzername oder Passwort!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log(contact);
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    console.log("status " + response.status);

    if (response.status === 200) {
      const responseData = await response.json();
      Cookies.set("token", responseData.token);

      alert("Successfully registered!");
      navigate("/"); // return to home when successfully registred
    } else if (response.status === 404) {
      alert("fail");
    } else {
      alert("User with this email allready exists!");
    }
  };

  return (
    <div>
      <main>
        <div className="p-4 mb-3"></div>
        <div
          className={`container d-flex align-items-center justify-content-center ${styles.outerContainer} mt-5 mb-5`}
        >
          <div className={`col-md-6 bg ${styles.innerContainer}`}>
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  required
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={` ${styles.customButton}`}>
                <span>Register</span>
              </button>
            </form>
            <button onClick={login} className={` ${styles.customButton}`}>
              <span>Login</span>
            </button>
          </div>
        </div>
        <div className=" p-5 mb-5"></div>
      </main>
    </div>
  );
};

export default Register;
