import React, { useState } from "react";
import "./PostRoom.css";

const PostRoom = () => {
  const [form, setForm] = useState({
    owner_name: "",
    phone: "",
    email: "",

    property_name: "",
    property_type: "",
    price: "",
    beds: "",
    room_no: "",
    floor: "",

    gender: "",
    room_type: "",
    sharing: "",

    address: "",
    city: "",

    wifi: false,
    food: false,
    ac: false,
    parking: false,
    pool: false,
    gym: false,
    laundry: false,

    breakfast: false,
    dinner: false,

    no_smoking: false,
    no_alcohol: false,
    no_pets: false,
    attached_bathroom: false,
    balcony: false,
    eb_bill_extra: false,

    description: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // =========================
  // Handle input changes
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // Handle image selection
  // =========================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Maximum 2 images because
    // current FastAPI accepts file1 and file2
    const newImages = [...images, ...selectedFiles].slice(0, 2);

    setImages(newImages);

    const previews = newImages.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // =========================
  // Remove image
  // =========================
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);

    setImages(newImages);

    const previews = newImages.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // =========================
  // Submit form
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Two images are mandatory
    if (images.length !== 2) {
      alert("Please upload exactly 2 images.");
      return;
    }

    try {
      const formData = new FormData();

      // =========================
      // Owner details
      // =========================
      formData.append("owner_name", form.owner_name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);

      // =========================
      // Property details
      // =========================
      formData.append("property_name", form.property_name);
      formData.append("property_type", form.property_type);
      formData.append("price", form.price);
      formData.append("beds", form.beds);
      formData.append("room_no", form.room_no);
      formData.append("floor", form.floor);

      // =========================
      // Room details
      // =========================
      formData.append("gender", form.gender);
      formData.append("room_type", form.room_type);
      formData.append("sharing", form.sharing);

      // =========================
      // Address
      // =========================
      formData.append("address", form.address);
      formData.append("city", form.city);

      // =========================
      // Amenities
      // =========================
      formData.append("wifi", form.wifi);
      formData.append("food", form.food);
      formData.append("ac", form.ac);
      formData.append("parking", form.parking);
      formData.append("pool", form.pool);
      formData.append("gym", form.gym);
      formData.append("laundry", form.laundry);

      // =========================
      // Food details
      // =========================
      formData.append("breakfast", form.breakfast);
      formData.append("dinner", form.dinner);

      // =========================
      // Rules / facilities
      // =========================
      formData.append("no_smoking", form.no_smoking);
      formData.append("no_alcohol", form.no_alcohol);
      formData.append("no_pets", form.no_pets);
      formData.append("attached_bathroom", form.attached_bathroom);
      formData.append("balcony", form.balcony);
      formData.append("eb_bill_extra", form.eb_bill_extra);

      // =========================
      // Description
      // =========================
      formData.append("description", form.description);

      // =========================
      // Images
      // =========================
      formData.append("file1", images[0]);
      formData.append("file2", images[1]);

      // =========================
      // Send to FastAPI
      // =========================
      const response = await fetch(
        "http://127.0.0.1:8000/rooms",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error:", data);
        alert("Failed to post room.");
        return;
      }

      console.log("Room created:", data);

      alert("Room posted successfully!");

      // =========================
      // Reset form
      // =========================
      setForm({
        owner_name: "",
        phone: "",
        email: "",

        property_name: "",
        property_type: "",
        price: "",
        beds: "",
        room_no: "",
        floor: "",

        gender: "",
        room_type: "",
        sharing: "",

        address: "",
        city: "",

        wifi: false,
        food: false,
        ac: false,
        parking: false,
        pool: false,
        gym: false,
        laundry: false,

        breakfast: false,
        dinner: false,

        no_smoking: false,
        no_alcohol: false,
        no_pets: false,
        attached_bathroom: false,
        balcony: false,
        eb_bill_extra: false,

        description: "",
      });

      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="postroom-container">
      <div className="postroom-card">

        <h1 className="postroom-title">
          Post Your Room
        </h1>

        <p className="postroom-subtitle">
          Add your property details and make your room available
        </p>

        <form onSubmit={handleSubmit}>

          {/* =========================
              OWNER DETAILS
          ========================= */}
          <div className="section">
            <h3>👤 Owner Details</h3>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Owner Name *
                </label>

                <input
                  type="text"
                  name="owner_name"
                  placeholder="Enter owner name"
                  value={form.owner_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number *
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>


          {/* =========================
              PROPERTY DETAILS
          ========================= */}
          <div className="section">
            <h3>🏢 Property Details</h3>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Property Name *
                </label>

                <input
                  type="text"
                  name="property_name"
                  placeholder="Enter property name"
                  value={form.property_name}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label>
                  Property Type *
                </label>

                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Type
                  </option>

                  <option value="PG">
                    PG
                  </option>

                  <option value="Rooms">
                    Rooms
                  </option>

                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="House">
                    House
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label>
                  Price (₹/month) *
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter monthly price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label>
                  Number of Beds
                </label>

                <input
                  type="number"
                  name="beds"
                  placeholder="Enter number of beds"
                  value={form.beds}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label>
                  Room No
                </label>

                <input
                  type="text"
                  name="room_no"
                  placeholder="Enter room number"
                  value={form.room_no}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label>
                  Floor
                </label>

                <input
                  type="text"
                  name="floor"
                  placeholder="Enter floor"
                  value={form.floor}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>


          {/* =========================
              ROOM FOR
          ========================= */}
          <div className="section">
            <h3>
              ⚧️ Room For *
            </h3>

            <div className="radio-group">

              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Men"
                  checked={form.gender === "Men"}
                  onChange={handleChange}
                  required
                />
                👨 Men Only
              </label>


              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Women"
                  checked={form.gender === "Women"}
                  onChange={handleChange}
                />
                👩 Women Only
              </label>


              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Any"
                  checked={form.gender === "Any"}
                  onChange={handleChange}
                />
                👥 Any Gender
              </label>

            </div>
          </div>


          {/* =========================
              ROOM TYPE
          ========================= */}
          <div className="section">
            <h3>🛏️ Room Type</h3>

            <div className="form-grid">

              <div className="form-group">
                <select
                  name="room_type"
                  value={form.room_type}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Room Type
                  </option>

                  <option value="Single">
                    Single
                  </option>

                  <option value="Double">
                    Double
                  </option>

                  <option value="Triple">
                    Triple
                  </option>

                  <option value="Four Share">
                    Four Share
                  </option>

                  <option value="Family">
                    Family
                  </option>
                </select>
              </div>

            </div>
          </div>


          {/* =========================
              SHARING TYPE
          ========================= */}
          <div className="section">
            <h3>👥 Sharing Type</h3>

            <div className="form-grid">

              <div className="form-group">
                <select
                  name="sharing"
                  value={form.sharing}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Sharing Type
                  </option>

                  <option value="Double Sharing">
                    Double Sharing
                  </option>

                  <option value="Triple Sharing">
                    Triple Sharing
                  </option>

                  <option value="Four Sharing">
                    Four Sharing
                  </option>
                </select>
              </div>

            </div>
          </div>


          {/* =========================
              ADDRESS
          ========================= */}
          <div className="section">
            <h3>📍 Address</h3>

            <div className="form-grid">

              <div className="form-group full-width">
                <label>
                  Full Address *
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Street, Area"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="form-group">
                <label>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Coimbatore"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          </div>


          {/* =========================
              ROOM IMAGES
          ========================= */}
          <div className="section">
            <h3>
              📷 Room Images *
            </h3>

            <p className="image-hint">
              Upload exactly 2 images
            </p>

            <label className="image-upload-box">

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageChange}
              />

              <div className="upload-placeholder">

                <div className="upload-icon">
                  📁
                </div>

                <p>
                  Click to upload images
                </p>

                <div className="upload-sub">
                  JPG, PNG supported
                </div>

              </div>

            </label>


            {imagePreviews.length > 0 && (
              <div className="image-previews">

                {imagePreviews.map((src, index) => (
                  <div
                    className="preview-wrapper"
                    key={index}
                  >

                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="preview-img"
                    />

                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>


          {/* =========================
              AMENITIES
          ========================= */}
          <div className="section">

            <h3>
              ✨ Amenities
            </h3>

            <div className="checkbox-group">

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={form.wifi}
                  onChange={handleChange}
                />
                📶 WiFi
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="food"
                  checked={form.food}
                  onChange={handleChange}
                />
                🍽️ Food
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="ac"
                  checked={form.ac}
                  onChange={handleChange}
                />
                ❄️ AC
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="parking"
                  checked={form.parking}
                  onChange={handleChange}
                />
                🚗 Parking
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="pool"
                  checked={form.pool}
                  onChange={handleChange}
                />
                🏊 Pool
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="gym"
                  checked={form.gym}
                  onChange={handleChange}
                />
                🏋️ Gym
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="laundry"
                  checked={form.laundry}
                  onChange={handleChange}
                />
                👕 Laundry
              </label>

            </div>
          </div>


          {/* =========================
              FOOD DETAILS
          ========================= */}
          <div className="section">

            <h3>
              🍽️ Food Details
            </h3>

            <div className="checkbox-group">

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="breakfast"
                  checked={form.breakfast}
                  onChange={handleChange}
                />
                Breakfast
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="dinner"
                  checked={form.dinner}
                  onChange={handleChange}
                />
                Dinner
              </label>

            </div>
          </div>


          {/* =========================
              RULES
          ========================= */}
          <div className="section">

            <h3>
              📋 Rules & Facilities
            </h3>

            <div className="checkbox-group">

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="no_smoking"
                  checked={form.no_smoking}
                  onChange={handleChange}
                />
                🚭 No Smoking
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="no_alcohol"
                  checked={form.no_alcohol}
                  onChange={handleChange}
                />
                🚫 No Alcohol
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="no_pets"
                  checked={form.no_pets}
                  onChange={handleChange}
                />
                🐕 No Pets
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="attached_bathroom"
                  checked={form.attached_bathroom}
                  onChange={handleChange}
                />
                🚿 Attached Bathroom
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="balcony"
                  checked={form.balcony}
                  onChange={handleChange}
                />
                🌇 Balcony
              </label>


              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="eb_bill_extra"
                  checked={form.eb_bill_extra}
                  onChange={handleChange}
                />
                ⚡ EB Bill Extra
              </label>

            </div>
          </div>


          {/* =========================
              DESCRIPTION
          ========================= */}
          <div className="section">

            <h3>
              📝 Description
            </h3>

            <div className="form-group">

              <textarea
                name="description"
                placeholder="Describe the room..."
                value={form.description}
                onChange={handleChange}
                rows="5"
              />

            </div>

          </div>


          {/* =========================
              SUBMIT
          ========================= */}
          <button
            type="submit"
            className="submit-btn"
          >
            Post Room
          </button>

        </form>
      </div>
    </div>
  );
};

export default PostRoom;