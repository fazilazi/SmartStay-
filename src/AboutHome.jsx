
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AboutHome.css";

const AboutHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/rooms/${id}`
        );

        if (!response.ok) {
          throw new Error("Room not found");
        }

        const data = await response.json();

        console.log("Room details:", data);

        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError("Unable to load room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const nextImage = () => {
    if (!room?.images?.length) return;

    setCurrentImage((prev) =>
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!room?.images?.length) return;

    setCurrentImage((prev) =>
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    const fileName = imagePath.split("\\").pop();

    return `http://127.0.0.1:8000/uploads/rooms/${fileName}`;
  };

  /* =========================
     SAVE ROOM
  ========================= */

  const handleSaveRoom = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!room) {
      alert("Room details not available.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/saved-rooms",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            property_id: room.id,
            property_name: room.property_name,
            location: `${room.address}, ${room.city}`,
            price: room.price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to save room.");
        return;
      }

      alert("Room saved successfully!");

    } catch (error) {
      console.error("Save room error:", error);
      alert("Server connection failed.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     BOOK NOW
  ========================= */

  const handleBookNow = () => {
    navigate("/booking", {
      state: {
        room: room,
      },
    });
  };

  if (loading) {
    return (
      <div className="about-home-container">
        <p>Loading room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-home-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="about-home-container">
        <p>Room not found.</p>
      </div>
    );
  }

  return (
    <div className="about-home-container">

      {/* NAVBAR */}

      <nav className="browse-navbar">

        <h2 className="browse-logo">
          SmartStay
        </h2>

        <ul className="browse-nav-links">

          <li>
            <button onClick={() => navigate("/")}>
              Home
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/browse")}>
              Browse Rooms
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/post-rooms")}>
              Post Rooms
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          </li>

        </ul>

      </nav>


      {/* IMAGE SLIDER */}

      <div className="room-slider">

        {room.images && room.images.length > 0 ? (

          <>

            <img
              className="room-slider-image"
              src={getImageUrl(
                room.images[currentImage].image_path
              )}
              alt={room.property_name}
            />

            {room.images.length > 1 && (

              <>

                <button
                  className="slider-btn slider-prev"
                  onClick={previousImage}
                >
                  ❮
                </button>

                <button
                  className="slider-btn slider-next"
                  onClick={nextImage}
                >
                  ❯
                </button>

                <div className="slider-dots">

                  {room.images.map((_, index) => (

                    <button
                      key={index}
                      className={
                        currentImage === index
                          ? "slider-dot active"
                          : "slider-dot"
                      }
                      onClick={() =>
                        setCurrentImage(index)
                      }
                    />

                  ))}

                </div>

              </>

            )}

          </>

        ) : (

          <div className="no-image">
            🏠
          </div>

        )}

      </div>


      {/* MAIN INFORMATION */}

      <div className="room-main-info">

        <div>

          <h1>
            {room.property_name}
          </h1>

          <p>
            📍 {room.address}, {room.city}
          </p>

          <span className="room-type-badge">
            {room.property_type}
          </span>

        </div>

        <div className="room-price">

          ₹{room.price}

          <span>
            /month
          </span>

        </div>

      </div>


      {/* DETAILS */}

      <div className="about-grid">

        <div className="about-card">

          <h3>
            Room Details
          </h3>

          <p>
            <strong>Room Type:</strong>{" "}
            {room.room_type || "Not specified"}
          </p>

          <p>
            <strong>Sharing:</strong>{" "}
            {room.sharing || "Not specified"}
          </p>

          <p>
            <strong>Beds:</strong>{" "}
            {room.beds ?? "Not specified"}
          </p>

          <p>
            <strong>Room No:</strong>{" "}
            {room.room_no || "Not specified"}
          </p>

          <p>
            <strong>Floor:</strong>{" "}
            {room.floor || "Not specified"}
          </p>

          <p>
            <strong>Gender:</strong>{" "}
            {room.gender || "Not specified"}
          </p>

        </div>


        <div className="about-card">

          <h3>
            Amenities
          </h3>

          <p>
            📶 WiFi: {room.wifi ? "Yes" : "No"}
          </p>

          <p>
            🍱 Food: {room.food ? "Yes" : "No"}
          </p>

          <p>
            ❄️ AC: {room.ac ? "Yes" : "No"}
          </p>

          <p>
            🚗 Parking: {room.parking ? "Yes" : "No"}
          </p>

          <p>
            🏊 Pool: {room.pool ? "Yes" : "No"}
          </p>

          <p>
            🏋️ Gym: {room.gym ? "Yes" : "No"}
          </p>

          <p>
            🧺 Laundry: {room.laundry ? "Yes" : "No"}
          </p>

        </div>


        <div className="about-card">

          <h3>
            Rules & Facilities
          </h3>

          <p>
            🚭 No Smoking:{" "}
            {room.no_smoking ? "Yes" : "No"}
          </p>

          <p>
            🚫 No Alcohol:{" "}
            {room.no_alcohol ? "Yes" : "No"}
          </p>

          <p>
            🐾 No Pets:{" "}
            {room.no_pets ? "Yes" : "No"}
          </p>

          <p>
            🚿 Attached Bathroom:{" "}
            {room.attached_bathroom ? "Yes" : "No"}
          </p>

          <p>
            🌇 Balcony:{" "}
            {room.balcony ? "Yes" : "No"}
          </p>

          <p>
            💡 EB Bill Extra:{" "}
            {room.eb_bill_extra ? "Yes" : "No"}
          </p>

        </div>

      </div>


      {/* FOOD */}

      <div className="about-card">

        <h3>
          Food Details
        </h3>

        <p>
          Breakfast:{" "}
          {room.breakfast
            ? "Available"
            : "Not available"}
        </p>

        <p>
          Dinner:{" "}
          {room.dinner
            ? "Available"
            : "Not available"}
        </p>

      </div>


      {/* OWNER */}

      <div className="about-card">

        <h3>
          Owner Details
        </h3>

        <p>
          <strong>Name:</strong>{" "}
          {room.owner_name}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {room.phone}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {room.email || "Not provided"}
        </p>

      </div>


      {/* DESCRIPTION */}

      <div className="about-card">

        <h3>
          Description
        </h3>

        <p>
          {room.description ||
            "No description available."}
        </p>

      </div>


      {/* ADDRESS */}

      <div className="address-section">

        <h3>
          Location
        </h3>

        <p>
          {room.address}, {room.city}
        </p>

        <div className="map-box">

          <iframe
            title="Room Location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${room.address}, ${room.city}`
            )}&output=embed`}
            width="100%"
            height="300"
            style={{
              border: 0,
              borderRadius: "12px",
            }}
            loading="lazy"
            allowFullScreen
          />

        </div>

      </div>


      {/* ACTIONS */}

      <div className="room-actions">

        <button
          className="save-btn"
          onClick={handleSaveRoom}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "❤️ Save Room"}
        </button>

        <button
          className="book-btn"
          onClick={handleBookNow}
        >
          Book Now
        </button>

      </div>

    </div>
  );
};

export default AboutHome;

