# Main Etrypoint 
# RTHA
#
# Created by Thornton on 03/01/2025

from typing import Union

from fastapi import FastAPI
from models.request import Medication

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/medication/{user_id}/{medication_id}")
def get_medication(user_id: str, medication_id: int, q: Union[str, None] = None):
    return {"user_id": user_id, "medication_id": medication_id, "q": q}

@app.get("/medication/{user_id}")
def get_medication_list(user_id: str):
    return {"message": "Get medication!"}

@app.put("/medication/add")
def add_mediation(medication: Medication):
    return {"message": "Added medication!"}

@app.put("/medication/update")
def update_mediation(medication: Medication):
    return {"message": "Updated medication!"}

@app.delete("/medication/{user_id}/{medication_id}")
def delete_medication(user_id: str, medication_id: int):
    return {"message": "Deleted medication!"}