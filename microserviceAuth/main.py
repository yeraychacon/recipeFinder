#all the imports

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pymysql
import jwt
import datetime
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from requests_oauthlib import OAuth2Session
from dotenv import load_dotenv
import os
from fastapi.responses import JSONResponse
from google.oauth2 import id_token
from google.auth.transport import requests

# configuration
db = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    db="recipefinder",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor
)

app = FastAPI(
    title="Authentication API", 
    description="API for user authentication and favorite recipes management.",
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

SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_jwt_token(data: dict):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data.update({"exp": expiration})
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256")
    return token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

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

async def getCurrentUser(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
class AddFavoriteRecipe(BaseModel):
    recipe: str

class DeleteFavoriteRecipe(BaseModel):
    recipe: str

class FavoriteRecipe(BaseModel):
    recipeId: str
    


    
@app.delete("/auth/favRecipe/delete")
async def delete_fav_recipe(recipe: DeleteFavoriteRecipe, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()

    query = "DELETE FROM favoriterecipes WHERE username=%s AND idRecipe=%s"
    cursor.execute(query, (user, recipe.recipe))  # Usar recipe.recipe
    db.commit()

    cursor.close()
    return {"message": "Receta eliminada de favoritos"}


@app.post("/auth/favRecipe/add")
async def add_fav_recipe(recipe: AddFavoriteRecipe, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()

    # Verifica si ya existe la receta en favoritos
    query = "SELECT * FROM favoriterecipes WHERE username=%s AND idRecipe=%s"
    cursor.execute(query, (user, recipe.recipe))
    existing_favorite = cursor.fetchone()

    if existing_favorite:
        cursor.close()
        raise HTTPException(status_code=400, detail="Receta ya añadida a favoritos")

    # Inserta la receta si no existe
    insert_query = "INSERT INTO favoriterecipes(username, idRecipe) VALUES (%s, %s)"
    cursor.execute(insert_query, (user, recipe.recipe))
    db.commit()

    cursor.close()
    return {"message": "Receta añadida a favoritos"}

@app.post("/auth/favRecipe/check")
async def check_fav_recipe(recipe: FavoriteRecipe, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()

    query = "SELECT * FROM favoriterecipes WHERE username=%s AND idRecipe=%s"

    cursor.execute(query, (user, recipe.recipeId))
    existing_favorite = cursor.fetchone()

    cursor.close()
    return {"isFavorite": existing_favorite is not None}

@app.get("/auth/favRecipe/list")
async def list_fav_recipe(user: str = Depends(getCurrentUser)):
    cursor = db.cursor()

    query = "SELECT idRecipe FROM favoriterecipes WHERE username=%s"
    cursor.execute(query, (user,))
    fav_recipes = cursor.fetchall()
    
    cursor.close()
    return fav_recipes

class addMeal(BaseModel):
    recipe: str
    
class deleteMeal(BaseModel):
    recipe: str
    
class Meal(BaseModel):
    recipe: str
    
@app.get("/auth/SavedMeals/add")
async def add_saved_meal(meal: addMeal, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()
    
    query = "SELECT * FROM savedMeals WHERE username=%s AND idRecipe=%s"
    cursor.execute(query, (user, meal.recipe))
    existing_meal = cursor.fetchone()
    
    if existing_meal:
        cursor.close()
        raise HTTPException(status_code=400, detail="Meal is already saved")
    
    insert_query = "INSERT INTO savedMeals(username, idRecipe) VALUES (%s, %s)"
    cursor.execute(insert_query, (user, meal.recipe))
    db.commit()
    
    cursor.close()
    return {"message": "Meal saved successfully"}

@app.get("/auth/SavedMeals/delete")
async def delete_saved_meal(meal: deleteMeal, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()
    
    query = "DELETE FROM savedMeals WHERE username=%s AND idRecipe=%s"
    cursor.execute(query, (user, meal.recipe))
    db.commit()
    
    cursor.close()
    return {"message": "Meal deleted successfully"}

@app.get("/auth/SavedMeals/check")
async def check_saved_meal(meal: Meal, user: str = Depends(getCurrentUser)):
    cursor = db.cursor()
    
    query = "SELECT * FROM savedMeals WHERE username=%s AND idRecipe=%s"
    cursor.execute(query, (user, meal.recipe))
    existing_meal = cursor.fetchone()
    
    cursor.close()
    return {"isSaved": existing_meal is not None}

@app.get("/auth/SavedMeals/list")
async def list_saved_meals(user: str = Depends(getCurrentUser)):
    cursor = db.cursor()
    
    query = "SELECT idRecipe FROM savedMeals WHERE username=%s"
    cursor.execute(query, (user,))
    saved_meals = cursor.fetchall()
    
    cursor.close()
    return saved_meals

@app.post("/auth/google")
async def google_login(user: dict):
    cursor = db.cursor()
    print(user)
            
    # Check if the user already exists in the database
    query = "SELECT * FROM user WHERE email=%s"
    cursor.execute(query, (user["credentialResponseDecoded"]["email"],))
    
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        token = create_jwt_token({"sub": existing_user["username"]})
        return {"access_token": token, "token_type": "bearer"}
    else:
        query = "INSERT INTO user (username, email, phone, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (user["credentialResponseDecoded"]["name"], user["credentialResponseDecoded"]["email"], "",""))
        db.commit()
        cursor.close()
        token = create_jwt_token({"sub": user["credentialResponseDecoded"]["name"]})
        return {"access_token": token, "token_type": "bearer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)