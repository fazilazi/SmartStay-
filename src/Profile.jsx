import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const years = Array.from({ length: 76 }, (_, i) => 2026 - i)
  .filter((y) => y >= 1950);

const Profile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    state: "",
  });

  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [bookings, setBookings] = useState([]);
  const [saved, setSaved] = useState([]);

  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // Get logged-in user's profile
  useEffect(() => {
    const token = localStorage.getItem("token");

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

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return null;
        }

        return data;
      })
      .then((data) => {
        if (!data) {
          return;
        }

        const nameParts = data.name
          ? data.name.split(" ")
          : [];

        setForm({
          firstName: nameParts[0] || "",
          lastName:
            data.last_name ||
            nameParts.slice(1).join(" ") ||
            "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          city: data.city || "",
          state: data.state || "",
        });

        if (data.dob) {
          const parts = data.dob.split("-");

          if (parts.length === 3) {
            setDob({
              day: parts[0],
              month: parts[1],
              year: parts[2],
            });
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile error:", error);

        localStorage.removeItem("token");
        navigate("/login");

        setLoading(false);
      });
  }, [navigate]);

  // Get logged-in user's bookings
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          console.error("Bookings error:", data);
          return [];
        }

        return data;
      })
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => {
        console.error("Bookings fetch error:", error);
      });
  }, [navigate]);

  // Get logged-in user's saved rooms
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/saved-rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          console.error("Saved rooms error:", data);
          return [];
        }

        return data;
      })
      .then((data) => {
        setSaved(data);
      })
      .catch((error) => {
        console.error("Saved rooms fetch error:", error);
      });
  }, [navigate]);

  // Form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile to MySQL
  const handleSave = async () => {
    if (
    !form.firstName ||
    !form.lastName ||
    !form.phone ||
    !form.gender ||
    !dob.day ||
    !dob.month ||
    !dob.year ||
    !form.city ||
    !form.state
  ) {
    alert("Please fill all fields");
    return;
  }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            gender: form.gender,
            dob: `${dob.day}-${dob.month}-${dob.year}`,
            city: form.city,
            state: form.state,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        alert("Profile update failed");
        return;
      }

      console.log("Updated profile:", data);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Server connection failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

const handleRemoveSaved = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/saved-rooms/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Failed to remove room");
      return;
    }

    // Remove from the current screen
    setSaved(saved.filter((room) => room.id !== id));

    alert("Room removed successfully");
  } catch (error) {
    console.error("Remove saved room error:", error);
    alert("Server connection failed");
  }
};

  return (
    <div className="profile-page">

      {/* NAVBAR */}

      <nav className="profile-navbar">

        <h2 className="logo">
          SmartStay
        </h2>

        <ul className="profile-nav-links">

          <li>
            <Link to="/">
              Home
            </Link>
          </li>

          <li>
            <Link to="/dashboard">
              Dashboard
            </Link>
          </li>

          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>

        </ul>

      </nav>

      {/* PROFILE LAYOUT */}

      <div className="profile-layout">

        {/* SIDEBAR */}

        <div className="profile-sidebar">

          <div className="sidebar-avatar">
            {form.firstName
              ? form.firstName.charAt(0).toUpperCase()
              : "?"}
          </div>

          <p className="sidebar-name">
            {form.firstName} {form.lastName}
          </p>

          <p className="sidebar-email">
            {form.email}
          </p>

          <div className="sidebar-menu">

            {/* MY PROFILE */}

            <div
              className={`sidebar-item ${
                activeTab === "profile"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              👤 My Profile
            </div>

            {/* MY BOOKINGS */}

            <div
              className={`sidebar-item ${
                activeTab === "bookings"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              📅 My Bookings
            </div>

            {/* SAVED ROOMS */}

            <div
              className={`sidebar-item ${
                activeTab === "saved"
                  ? "active"
                  : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              ❤️ Saved Rooms
            </div>

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="profile-main">

          {/* ================= PROFILE TAB ================= */}

          {activeTab === "profile" && (
            <>
              <div className="profile-main-header">

                <h2>
                  My Profile
                </h2>

                <button
                  className="save-btn"
                  onClick={handleSave}
                >
                  SAVE
                </button>

              </div>

              {success && (
                <div className="success-msg">
                  ✅ Profile updated successfully!
                </div>
              )}

              <div className="profile-section">

                <h3 className="section-label">
                  General Information
                </h3>

                <div className="form-row">

                  {/* DATE OF BIRTH */}

                  <div className="pform-group">

                    <label>
                      DATE OF BIRTH
                    </label>

                    <div className="dob-selects">

                      <select
                        value={dob.day}
                        onChange={(e) =>
                          setDob({
                            ...dob,
                            day: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          Day
                        </option>

                        {days.map((d) => (
                          <option
                            key={d}
                            value={d}
                          >
                            {d}
                          </option>
                        ))}

                      </select>

                      <select
                        value={dob.month}
                        onChange={(e) =>
                          setDob({
                            ...dob,
                            month: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          Month
                        </option>

                        {months.map((m, i) => (
                          <option
                            key={i}
                            value={m}
                          >
                            {m}
                          </option>
                        ))}

                      </select>

                      <select
                        value={dob.year}
                        onChange={(e) =>
                          setDob({
                            ...dob,
                            year: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          Year
                        </option>

                        {years.map((y) => (
                          <option
                            key={y}
                            value={y}
                          >
                            {y}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                  {/* GENDER */}

                  <div className="pform-group">

                    <label>
                      GENDER
                    </label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>

                </div>

                {/* FIRST + LAST NAME */}

                <div className="form-row">

                  <div className="pform-group">

                    <label>
                      FIRST NAME
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="pform-group">

                    <label>
                      LAST NAME
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />

                  </div>

                </div>

                {/* CITY + STATE */}

                <div className="form-row">

                  <div className="pform-group">

                    <label>
                      CITY
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                    />

                  </div>

                  <div className="pform-group">

                    <label>
                      STATE
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                    />

                  </div>

                </div>

              </div>

              {/* CONTACT DETAILS */}

              <div className="profile-section">

                <h3 className="section-label">
                  Contact Details
                </h3>

                <div className="form-row">

                  <div className="pform-group">

                    <label>
                      MOBILE NUMBER
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                    />

                  </div>

                  <div className="pform-group">

                    <label>
                      EMAIL ADDRESS
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                    />

                  </div>

                </div>

              </div>
            </>
          )}

          {/* ================= BOOKINGS TAB ================= */}

          {activeTab === "bookings" && (
            <div className="tab-content">

              <h2>
                My Bookings
              </h2>

              {bookings.length === 0 ? (

                <p className="empty-msg">
                  No bookings yet!{" "}
                  <Link to="/browse">
                    Browse rooms
                  </Link>
                </p>

              ) : (

                <div className="bookings-list">

                  {bookings.map((booking) => (

                    <div
                      className="booking-item"
                      key={booking.id}
                    >

                      <h3>
                        📅 Booking #{booking.id}
                      </h3>

                      <p>
                        🏠 Property:{" "}
                        <strong>
                          {booking.property_name}
                        </strong>
                      </p>

                      <p>
                        📍 Location:{" "}
                        {booking.location}
                      </p>

                      <p>
                        💰 Price:{" "}
                        <strong>
                          ₹{booking.price}
                        </strong>{" "}
                        / month
                      </p>

                      <p>
                        🛏️ Room Type:{" "}
                        <strong>
                          {booking.room_type}
                        </strong>
                      </p>

                      <p>
                        📅 Check-in:{" "}
                        <strong>
                          {booking.check_in}
                        </strong>
                      </p>

                      {booking.check_out && (
                        <p>
                          📅 Check-out:{" "}
                          <strong>
                            {booking.check_out}
                          </strong>
                        </p>
                      )}

                      <p>
                        Status:{" "}
                        <strong>
                          {booking.status}
                        </strong>
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>
          )}

{/* ================= SAVED ROOMS TAB ================= */}

{activeTab === "saved" && (
  <div className="tab-content">

    <h2>
      Saved Rooms
    </h2>

    {saved.length === 0 ? (

      <p className="empty-msg">
        No saved rooms yet!{" "}
        <Link to="/browse">
          Browse rooms
        </Link>
      </p>

    ) : (

      <div className="saved-grid">

        {saved.map((room) => (

          <div
            key={room.id}
            className="saved-card"
          >

            <Link
              to={"/property/" + room.property_id}
            >
              <h4>
                {room.property_name}
              </h4>

              <p>
                📍 {room.location}
              </p>

              <p className="saved-price">
                ₹{room.price}/month
              </p>
            </Link>

            <button
              onClick={() => handleRemoveSaved(room.id)}
            >
              ❌ Remove
            </button>

          </div>

        ))}

      </div>

    )}

  </div>
)}      

    </div>

    </div>
</div>
  );
};

export default Profile;

