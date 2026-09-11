import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");


const handleLogin = async (e) => {
  e.preventDefault();

  console.log("LOGIN BUTTON CLICKED");

  if (!loginEmail || !loginPassword) {
    setLoginError("All fields are required");
    return;
  }

  if (!loginEmail.endsWith("@gmail.com")) {
    setLoginError("Email must use @gmail.com");
    return;
  }

  setLoginError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    console.log("Login status:", response.status);
    console.log("Login response:", data);

    if (!response.ok) {
      setLoginError(
        Array.isArray(data.detail)
          ? data.detail[0].msg
          : data.detail || "Login failed"
      );
      return;
    }

    localStorage.setItem("token", data.access_token);

    alert("Login successful!");

    navigate("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    setLoginError("Server connection failed");
  }
};



  const handleSignup = async (e) => {
  e.preventDefault();

  if (!signupName || !signupEmail || !signupPassword) {
    setSignupError("All fields are required");
    return;
  }

  if (!signupEmail.endsWith("@gmail.com")) {
    setSignupError("Email must use @gmail.com");
    return;
  }

  if (signupPassword.length < 6) {
    setSignupError("Password must be at least 6 characters");
    return;
  }

  setSignupError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
    });

    const data = await response.json();  // ← THIS WAS MISSING

    if (!response.ok) {
      setSignupError(
        Array.isArray(data.detail)
          ? data.detail[0].msg
          : data.detail
      );
      return;
    }

    alert("Sign Up successful!");

    console.log(data);

    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setTab("login");

  } catch (error) {
    setSignupError("Server connection failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-form">

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "login" ? "tab active" : "tab"}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "signup" ? "tab active" : "tab"}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin}>
            <h2>Welcome Back 🫶🏻</h2>
            {loginError && <p className="error">{loginError}</p>}

            <input
              type="email"
              placeholder="Enter email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={() => setTab("signup")}>Sign Up</span>
            </p>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === "signup" && (
          <form onSubmit={handleSignup}>
            <h2>Create Account 🏠</h2>
            {signupError && <p className="error">{signupError}</p>}

            <input
              type="text"
              placeholder="Enter your name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setTab("login")}>Login</span>
            </p>
          </form> 
        )}

      </div>
    </div>
  );
};

export default Login;