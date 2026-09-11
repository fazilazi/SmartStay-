
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [loading, setLoading] = useState(false);

  if (!room) {
    return (
      <div className="booking-page">
        <h2>Room details not found.</h2>

        <button onClick={() => navigate("/browse")}>
          Browse Rooms
        </button>
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!checkIn) {
      alert("Please select check-in date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            property_name: room.property_name,
            location: `${room.address}, ${room.city}`,
            price: room.price,
            room_type: room.room_type || "Not specified",
            check_in: checkIn,
            check_out: checkOut || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Booking failed.");
        return;
      }

      alert("Booking successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error("Booking error:", error);

      alert("Server connection failed.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">

      <nav className="booking-navbar">

        <h2>SmartStay</h2>

        <button
          onClick={() => navigate("/browse")}
        >
          Back to Rooms
        </button>

      </nav>


      <div className="booking-container">

        <h1>Book Your Room</h1>


        {/* SELECTED PROPERTY */}

        <div className="booking-property-card">

          <h2>
            {room.property_name}
          </h2>

          <p>
            📍 {room.address}, {room.city}
          </p>

          <p>
            🏠 {room.property_type}
          </p>

          <h3>
            ₹{room.price}/month
          </h3>

          <p>
            Room Type:{" "}
            {room.room_type || "Not specified"}
          </p>

        </div>


        {/* BOOKING FORM */}

        <form
          className="booking-form"
          onSubmit={handleBooking}
        >

          <label>
            Check-in Date
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(e.target.value)
            }
            required
          />


          <label>
            Check-out Date
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(e.target.value)
            }
          />


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Confirm Booking"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Booking;

