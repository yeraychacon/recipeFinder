#all the imports

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# configuration
db = pymysql.connect(
    host="localhost",
    user="root",
    password="1234",
    db="autentificacion",
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


