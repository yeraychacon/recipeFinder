#all the imports

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# configuration
db = pymysql.connect(
    host="localhost",
    user="root",
    password="1234",
    db="recipefinder",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)

app = FastAPI(
    title="API de Autenticación",
    description="API para autenticación de usuarios y gestión de destinos favoritos.",
    version="1.0.0",
    docs_url="/docs",  
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data.update({"exp": expiration})
    token = jwt.encode(data, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

@app.post("/auth/token")
async def generate_token(from_data: OAuth2PasswordRequestForm = Depends()):
    cursor = db.cursor()
    query = "SELECT * FROM user WHERE username=%s AND password=%s"
    cursor.execute(query, (from_data.username, from_data.password))
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        token = create_jwt_token({"sub": user["username"]})
        return {"access_token": token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
@app.post("/auth/register")
async def register(user: User):
    cursor = db.cursor()
    
    # Check if the user already exists in the database
    query = "SELECT * FROM user WHERE username=%s"
    cursor.execute(query, (user.username,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        raise HTTPException(status_code=400, detail="User already exists")
    
    query = "INSERT INTO user (username, password, email, phone) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (user.username, user.password, user.email, user.phone))

    db.commit()
    cursor.close()
    return {"message": "Usuario registrado con éxito"}