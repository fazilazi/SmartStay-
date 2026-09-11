from fastapi import FastAPI,Depends,HTTPException,UploadFile,File,Form
from database import SessionLocal,get_db,Base,engine
from schemas import Usercreate,UserResponse,UserUpdate,BookingCreate,BookingResponse,LoginRequest
from pydantic import BaseModel
from utils import hash_password,verify_password
from auth import create_access_token,get_current_user
from fastapi.middleware.cors import CORSMiddleware
from models import User, Booking, SavedRoom,Room,RoomImage
from schemas import SavedRoomCreate, SavedRoomResponse, RoomCreate,RoomResponse
import os
import shutil
from sqlalchemy.orm import Session
from uuid import uuid4
from typing import List
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/use")
def create_user(user:Usercreate):

    db = SessionLocal()
    user = User(name=user.name,age=user.age)

    db.add(user)

    db.commit()

    db.refresh(user)

    db.close()

    return user


@app.get("/use", response_model=list[UserResponse])  
def get(): 

    db =SessionLocal()

    users = db.query(User).all()

    if users is None:
        raise HTTPException(status_code=404,detail="user ila poda punda")

    db.close()

    return users

@app.get("/")
def home():
    return {"message": "Welcome to my FastAPI application"}

# For Writing the db=SessionLocal() and db.close() for each method so we create database model get_db like Depends 

@app.get("/users")
def getuser( db=Depends(get_db)):
    users=db.query(User).all()

    if users is None:
        raise HTTPException(status_code=404,detail="user ila poda punda")

    return users

@app.post("/users", response_model=UserResponse)
def postuser(user:Usercreate,db=Depends(get_db)):
    db_user = User(name=user.name,age=user.age)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{id}",response_model=UserResponse)
def update(user:UserUpdate,id:int,db=Depends(get_db)):

    db_user = db.query(User).filter(User.id == id).first()
    
    if db_user is None:
        raise HTTPException(status_code=404,detail="user ila poda punda")
        
    db_user.name=user.name
    
    db_user.age=user.age    

    db.commit()
    return db_user

@app.delete("/users/{id}")
def delete(id:int,db = Depends(get_db)):

    db_user=db.query(User).filter(User.id == id).first()

    if db_user is None:
        raise HTTPException(status_code=404,detail="user ila poda punda")

    db.delete(db_user)

    db.commit()

    return{"message":"user data is deleted "}

@app.get("/age")
def getuse(age:int | None = None , db= Depends(get_db)):

    user = db.query(User).filter(User.age == age).first()

    return user

#Booking part 

@app.post("/bookings", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    db_booking = Booking(
        user_id=current_user.id,
        property_name=booking.property_name,
        location=booking.location,
        price=booking.price,
        room_type=booking.room_type,
        check_in=booking.check_in,
        check_out=booking.check_out,
        status="Confirmed"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    return db_booking


@app.get("/bookings", response_model=list[BookingResponse])
def get_bookings(
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()

    return bookings


@app.delete("/bookings/{id}")
def delete_booking(
    id: int,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.id == id,
        Booking.user_id == current_user.id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted successfully"}



# Main Login Form

@app.post("/register", response_model=UserResponse)
def register(user: Usercreate, db=Depends(get_db)):

    exist = db.query(User).filter(User.email == user.email).first()

    if exist:
        raise HTTPException(status_code=404, detail="email id already exists!!")

    hashed_password = hash_password(user.password)

    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@app.post("/login")
def login(user: LoginRequest, db=Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Wrong password"
        )

    token = create_access_token({
        "user_id": db_user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }



@app.put("/profile")
def update_profile(
    profile: UserUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    current_user.name = profile.name
    current_user.last_name = profile.last_name
    current_user.phone = profile.phone
    current_user.gender = profile.gender
    current_user.dob = profile.dob
    current_user.city = profile.city
    current_user.state = profile.state

    db.commit()
    db.refresh(current_user)

    return current_user


@app.get("/protected")
def protect(currentuser=Depends(get_current_user)):
    return {
        "id": currentuser.id,
        "name": currentuser.name,
        "last_name": currentuser.last_name,
        "email": currentuser.email,
        "phone": currentuser.phone,
        "gender": currentuser.gender,
        "dob": currentuser.dob,
        "city": currentuser.city,
        "state": currentuser.state
    }


# Post Rooms

@app.post("/rooms", response_model=RoomResponse)
def create_room(
    owner_name: str = Form(...),
    phone: str = Form(...),
    email: str | None = Form(None),

    property_name: str = Form(...),
    property_type: str = Form(...),
    price: int = Form(...),
    beds: int | None = Form(None),
    room_no: str | None = Form(None),
    floor: str | None = Form(None),

    gender: str = Form(...),
    room_type: str | None = Form(None),
    sharing: str | None = Form(None),

    address: str | None = Form(None),
    city: str | None = Form(None),

    wifi: bool = Form(False),
    food: bool = Form(False),
    ac: bool = Form(False),
    parking: bool = Form(False),
    pool: bool = Form(False),
    gym: bool = Form(False),
    laundry: bool = Form(False),

    breakfast: bool = Form(False),
    dinner: bool = Form(False),

    no_smoking: bool = Form(False),
    no_alcohol: bool = Form(False),
    no_pets: bool = Form(False),

    attached_bathroom: bool = Form(False),
    balcony: bool = Form(False),
    eb_bill_extra: bool = Form(False),

    description: str | None = Form(None),

    # BOTH IMAGES ARE MANDATORY
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),

    db: Session = Depends(get_db)
):
    # Create room
    new_room = Room(
        owner_name=owner_name,
        phone=phone,
        email=email,

        property_name=property_name,
        property_type=property_type,
        price=price,
        beds=beds,
        room_no=room_no,
        floor=floor,

        gender=gender,
        room_type=room_type,
        sharing=sharing,

        address=address,
        city=city,

        wifi=wifi,
        food=food,
        ac=ac,
        parking=parking,
        pool=pool,
        gym=gym,
        laundry=laundry,

        breakfast=breakfast,
        dinner=dinner,

        no_smoking=no_smoking,
        no_alcohol=no_alcohol,
        no_pets=no_pets,

        attached_bathroom=attached_bathroom,
        balcony=balcony,
        eb_bill_extra=eb_bill_extra,

        description=description
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    # Image upload folder
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    upload_folder = os.path.join(
        BASE_DIR,
        "uploads",
        "rooms"
    )

    os.makedirs(upload_folder, exist_ok=True)

    # Both files are mandatory
    files = [file1, file2]

    for file in files:

        extension = os.path.splitext(file.filename)[1]

        filename = f"{uuid4().hex}{extension}"

        file_path = os.path.join(
            upload_folder,
            filename
        )

        # Save actual image
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Save image path in MySQL
        image = RoomImage(
            room_id=new_room.id,
            image_path=file_path
        )

        db.add(image)

    db.commit()

    return new_room



@app.get("/rooms", response_model=List[RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return rooms

@app.get("/rooms/{room_id}", response_model=RoomResponse)
def get_room(room_id: int, db: Session = Depends(get_db)):

    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return room


# Room Saved Button

@app.post("/saved-rooms", response_model=SavedRoomResponse)
def save_room(
    room: SavedRoomCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedRoom).filter(
        SavedRoom.user_id == current_user.id,
        SavedRoom.property_id == room.property_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Room already saved"
        )

    saved_room = SavedRoom(
        user_id=current_user.id,
        property_id=room.property_id,
        property_name=room.property_name,
        location=room.location,
        price=room.price
    )

    db.add(saved_room)
    db.commit()
    db.refresh(saved_room)

    return saved_room

@app.get("/saved-rooms", response_model=list[SavedRoomResponse])
def get_saved_rooms(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_rooms = db.query(SavedRoom).filter(
        SavedRoom.user_id == current_user.id
    ).all()

    return saved_rooms


@app.delete("/saved-rooms/{id}")
def delete_saved_room(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_room = db.query(SavedRoom).filter(
        SavedRoom.id == id,
        SavedRoom.user_id == current_user.id
    ).first()

    if saved_room is None:
        raise HTTPException(
            status_code=404,
            detail="Saved room not found"
        )

    db.delete(saved_room)
    db.commit()

    return {
        "message": "Saved room removed successfully"
    }

