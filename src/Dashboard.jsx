import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Check logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        console.log("Protected status:", response.status);
        console.log("Protected data:", data);

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }

        return data;
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Protected error:", error);

        localStorage.removeItem("token");
        navigate("/login");
        setLoading(false);
      });
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dash-page">

      {/* Navbar */}
      <nav className="dash-navbar">

        <h2 className="dash-logo">
          SmartStay
        </h2>

        <ul className="dash-nav-links">

          <li>
            <Link to="/">
              Home
            </Link>
          </li>

          <li>
            <Link to="/profile">
              Profile
            </Link>
          </li>

          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>

        </ul>

      </nav>


      <div className="dash-layout">

        {/* Sidebar */}
        <div className="dash-sidebar">

          <div className="dash-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <p className="dash-username">
            {user.name}
          </p>

          <p className="dash-useremail">
            {user.email}
          </p>


          <div className="dash-menu">

            {/* Overview */}
            <div
              className={`dash-menu-item ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </div>


            {/* Profile Summary */}
            <div
              className={`dash-menu-item ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile Summary
            </div>

          </div>

        </div>


        {/* Main */}
        <div className="dash-main">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>

              <h2 className="dash-title">
                Welcome back, {user.name}! 👋
              </h2>


              <div className="dashboard-welcome">

                <h3>
                  Welcome to SmartStay
                </h3>

                <p>
                  Find your perfect room and manage your
                  bookings from your profile.
                </p>

                <Link
                  to="/browse"
                  className="edit-profile-btn"
                >
                  🔍 Browse Rooms
                </Link>

              </div>

            </>
          )}


          {/* PROFILE SUMMARY */}
          {activeTab === "profile" && (
            <>

              <h2 className="dash-title">
                Profile Summary
              </h2>


              <div className="profile-summary-card">

                <div className="ps-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>


                <div className="ps-info">

                  <h3>
                    {user.name}
                  </h3>

                  <p>
                    📧 {user.email}
                  </p>

                  <Link
                    to="/profile"
                    className="edit-profile-btn"
                  >
                    ✏️ Edit Profile
                  </Link>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;