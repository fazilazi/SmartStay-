# from fastapi import FastAPI
# from pydantic import BaseModel

# app = FastAPI()

# class User(BaseModel):
#     name: str
#     age: int

# @app.post("/user")
# def create(user:User):
#     return user

# @app.get("/")
# def home():
#     return {"message": "fastapi vaada"}

# # @app.get("/user/{id}")
# # def get(id:int):
# #     return {"id":id}

# # @app.get("/user")
# # def gets(id:int):
# #     return {"id":id}


# from database import engine,Base
# from models import User

# Base.metadata.create_all(bind=engine)