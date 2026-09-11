import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import PostRoom from "./PostRoom";
import AboutHome from "./AboutHome";
import Booking from "./Booking";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import BrowseRooms from "./BrowseRooms";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/post-rooms" element={<PostRoom />} />
      <Route path="/booking" element={<Booking/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/browse" element={<BrowseRooms />} />
      <Route path="/property/:id" element={<AboutHome />} />
      
    </Routes>
  );
}
export default App;

