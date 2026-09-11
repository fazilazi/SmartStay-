from pydantic import BaseModel

class Usercreate(BaseModel):
    name:str
    email:str
    password:str

class UserResponse(BaseModel):
    id:int
    name:str
    last_name: str | None = None 
    email: str
    phone: str | None = None 
    gender: str | None = None 
    dob: str | None = None 
    city: str | None = None
    state: str | None = None

    class Config:
        from_attributes=True

class UserUpdate(BaseModel):
    name: str
    last_name: str | None = None 
    phone: str | None = None
    gender: str | None = None 
    dob: str | None = None
    city: str | None = None
    state: str | None = None
    
class BookingCreate(BaseModel):
    property_name: str
    location: str
    price: int
    room_type: str
    check_in: str
    check_out: str | None = None

class BookingResponse(BaseModel):
    id: int
    user_id: int
    property_name: str
    location: str
    price: int
    room_type: str
    check_in: str
    check_out: str | None = None
    status: str

    class Config:
        from_attributes=True

class LoginRequest(BaseModel):
    password: str
    email:str

class SavedRoomCreate(BaseModel):
    property_id: int
    property_name: str
    location: str
    price: int


class SavedRoomResponse(BaseModel):
    id: int
    user_id: int
    property_id: int
    property_name: str
    location: str
    price: int

    class Config:
        from_attributes = True



class RoomCreate(BaseModel):
    owner_name: str
    phone: str
    email: str | None = None

    property_name: str
    property_type: str
    price: int
    beds: int | None = None
    room_no: str | None = None
    floor: str | None = None

    gender: str
    room_type: str | None = None
    sharing: str | None = None

    address: str
    city: str 

    wifi: bool = False
    food: bool = False
    ac: bool = False
    parking: bool = False
    pool: bool = False
    gym: bool = False
    laundry: bool = False

    breakfast: bool = False
    dinner: bool = False

    no_smoking: bool = False
    no_alcohol: bool = False
    no_pets: bool = False

    attached_bathroom: bool = False
    balcony: bool = False
    eb_bill_extra: bool = False

    description: str | None = None


class RoomResponse(RoomCreate):
    id: int
    images: list[RoomImageResponse] = []

    class Config:
        from_attributes = True


class RoomImageResponse(BaseModel):
    id: int
    image_path: str

    class Config:
        from_attributes = True