import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const allRooms = [
  { id: 1, name: "Fazil PG", category: "PG Rooms", location: "Coimbatore", price: 5000 },
  { id: 2, name: "Green Valley Apartment", category: "Apartment", location: "Chennai", price: 12000 },
  { id: 3, name: "Royal Villa", category: "Villa", location: "Bangalore", price: 35000 },
  { id: 4, name: "Metro House", category: "House", location: "Coimbatore", price: 18000 },
  { id: 5, name: "Sunrise PG", category: "PG Rooms", location: "Chennai", price: 4500 },
  { id: 6, name: "Prestige Apartment", category: "Apartment", location: "Bangalore", price: 15000 },
];

const categories = [
  { label: "🏠 Villa", value: "Villa" },
  { label: "🏢 Apartment", value: "Apartment" },
  { label: "🛏️ PG Rooms", value: "PG Rooms" },
  { label: "🏡 House", value: "House" },
];

const Home = () => {  
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");


  const filteredRooms = allRooms.filter((r) =>
    selectedCategory ? r.category === selectedCategory : true
  );

  return (
    <div className="home-page">

      <nav className="navbar">
        <h2 className="logo">SmartStay</h2>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Get Started</Link></li>
          <li><Link to="/post-rooms">Post Rooms</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      <section className="hero">
        <h1>Welcome to SmartStay</h1>
        <p>One Step Ahead To Book Rooms & Web Experiences</p>

        <button onClick={() => window.location.href = "/browse"}>
  🔍 Book Rooms
        </button>
        
      </section>

      {showFilter && (
        <section className="filter-section">
          <h3 className="filter-title">Select Category</h3>
          <div className="category-btns">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={"cat-btn" + (selectedCategory === cat.value ? " active" : "")}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="filter-rooms">
            {filteredRooms.map((room) => (
              <a key={room.id} href={"/property/" + room.id} className="filter-room-card">
                <div className="filter-room-icon">🏠</div>
                <div className="filter-room-info">
                  <h4>{room.name}</h4>
                  <p>📍 {room.location}</p>
                  <span className="filter-room-category">{room.category}</span>
                </div>
                <div className="filter-room-price">
                  ₹{room.price}<span>/mo</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="features">
        <div className="feature-card">
          <h3>Move Faster</h3>
          <p><i>No More PG Hunting, It's Simple.</i></p>
        </div>
        <div className="feature-card">
          <h3>Secure & Safe</h3>
          <p><i>We Keep Your Data Safe And Private.</i></p>
        </div>
        <div className="feature-card">
          <h3>User Friendly</h3>
          <p><i>Clean And Simple User Experience.</i></p>
        </div>
      </section>

      <section className="about">
        <h2>About Us</h2>
        <p>We Build Modern, Scalable, And User-Friendly Web Applications Using The Latest Technologies.</p>
      </section>

      <footer className="footer">
        <p>© 2026 Website LLC All Rights Reserved.</p>
        <p>SmartStay Is Part Of Booking Rooms Inc., Contact Us For More Details.</p>
      </footer>

    </div>
  );
};

export default Home;