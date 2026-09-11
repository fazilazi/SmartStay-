from sqlalchemy import Column,String,Integer,ForeignKey,Table,Boolean
from sqlalchemy.orm import relationship 
from database import Base



class User(Base):
     __tablename__ = "userstable"
     id = Column(Integer, primary_key=True, index=True) 
     name = Column(String(100))
     last_name = Column(String(100), nullable=True) 
     email = Column(String(50))
     password = Column(String(255))
     phone = Column(String(15), nullable=True)
     gender = Column(String(20), nullable=True) 
     dob = Column(String(20), nullable=True) 
     city = Column(String(100), nullable=True)
     state = Column(String(100), nullable=True) 
     bookings = relationship("Booking", back_populates="user")

class Booking(Base):
    __tablename__="bookings"

    id=Column(Integer,primary_key=True)

    user_id=Column(Integer,ForeignKey("userstable.id"))
    property_name = Column(String(100))
    location = Column(String(255))
    price = Column(Integer)
    room_type = Column(String(50))
    check_in = Column(String(50))
    check_out = Column(String(50), nullable=True)
    status = Column(String(50), default="Confirmed")

    user = relationship("User", back_populates="bookings")


class SavedRoom(Base):
    __tablename__ = "saved_rooms"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("userstable.id")
    )

    property_id = Column(Integer)

    property_name = Column(String(100))
    location = Column(String(255))
    price = Column(Integer)

    user = relationship("User")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer,primary_key=True,index=True)

    # Owner details
    owner_name = Column(String(100))
    phone = Column(String(15))
    email = Column(String(100), nullable=True)

    # Property details
    property_name = Column(String(100), nullable = False)
    property_type = Column(String(50))
    price = Column(Integer)
    beds = Column(Integer, nullable=True)
    room_no = Column(String(50), nullable=True)
    floor = Column(String(50), nullable=True)

    # Room details
    gender = Column(String(20))
    room_type = Column(String(50), nullable=True)
    sharing = Column(String(50), nullable=True)

    # Address
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)

    # Amenities
    wifi = Column(Boolean, default=False)
    food = Column(Boolean, default=False)
    ac = Column(Boolean, default=False)
    parking = Column(Boolean, default=False)
    pool = Column(Boolean, default=False)
    gym = Column(Boolean, default=False)
    laundry = Column(Boolean, default=False)

    # Food details
    breakfast = Column(Boolean, default="false")
    dinner = Column(Boolean, default="false")

    # House rules
    no_smoking = Column(Boolean, default="false")
    no_alcohol = Column(Boolean, default="false")
    no_pets = Column(Boolean, default="false")

    # Room features
    attached_bathroom = Column(Boolean, default="false")
    balcony = Column(Boolean, default="false")
    eb_bill_extra = Column(Boolean, default="false")

    # Description
    description = Column(String(1000), nullable=True)

    images = relationship("RoomImage", back_populates="room")

class RoomImage(Base):
    __tablename__ = "room_images"

    id = Column(Integer, primary_key=True, index=True)

    room_id = Column(Integer, ForeignKey("rooms.id"))

    image_path = Column(String(255))

    room = relationship("Room", back_populates="images")

