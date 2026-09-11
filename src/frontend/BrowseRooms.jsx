
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BrowseRooms.css";

const categories = [
  { label: "🏠 Villa", value: "Villa" },
  { label: "🏢 Apartment", value: "Apartment" },
  { label: "🛏️ PG Rooms", value: "PG Rooms" },
  { label: "🏡 House", value: "House" },
];

const BrowseRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/rooms");

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();

        console.log("Rooms from backend:", data);

        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Unable to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    selectedCategory
      ? room.property_type === selectedCategory
      : true
  );

  return (
    <div className="browse-page">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="browse-navbar">
        <h2 className="browse-logo">
          SmartStay
        </h2>

        <ul className="browse-nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/login">Get Started</Link>
          </li>

          <li>
            <Link to="/post-rooms">Post Rooms</Link>
          </li>

          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>


      {/* =========================
          HEADER
      ========================= */}
      <div className="browse-header">
        <h1>Browse Rooms</h1>
        <p>Find your perfect stay</p>
      </div>


      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div className="browse-container">

        <h3 className="filter-title">
          Select Category
        </h3>


        {/* =========================
            CATEGORY BUTTONS
        ========================= */}
        <div className="category-btns">

          {categories.map((cat) => (
            <button
              key={cat.value}
              className={
                "cat-btn" +
                (selectedCategory === cat.value
                  ? " active"
                  : "")
              }
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.value
                    ? ""
                    : cat.value
                )
              }
            >
              {cat.label}
            </button>
          ))}

        </div>


        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <p className="rooms-message">
            Loading rooms...
          </p>
        )}


        {/* =========================
            ERROR
        ========================= */}
        {!loading && error && (
          <p className="rooms-message error">
            {error}
          </p>
        )}


        {/* =========================
            NO ROOMS
        ========================= */}
        {!loading &&
          !error &&
          filteredRooms.length === 0 && (
            <p className="rooms-message">
              No rooms available.
            </p>
          )}


        {/* =========================
            ROOM LIST
        ========================= */}
        {!loading && !error && (
          <div className="filter-rooms">

            {filteredRooms.map((room) => (

              <Link
                key={room.id}
                to={"/property/" + room.id}
                className="filter-room-card"
              >

{/* Room icon */}
   <div className="filter-room-icon">
  {room.images && room.images.length > 0 ? (
    <img
      src={`http://127.0.0.1:8000/uploads/rooms/${room.images[0].image_path.split("\\").pop()}`}
      alt={room.property_name}
    />
  ) : (
    "🏠"
  )}
</div>


                {/* Room details */}
                <div className="filter-room-info">

                  <h4>
                    {room.property_name}
                  </h4>

                  <p>
                    📍 {room.city}
                  </p>

                  <span className="filter-room-category">
                    {room.property_type}
                  </span>

                </div>


                {/* Price */}
                <div className="filter-room-price">

                  ₹{room.price}

                  <span>
                    /mo
                  </span>

                </div>

              </Link>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseRooms;
