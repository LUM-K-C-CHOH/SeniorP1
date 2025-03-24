from fastapi import APIRouter, HTTPException
from models.request import Medication, Frequency
import service  # Importing business logic functions

router = APIRouter()

@router.get("/")
def root():
    users = service.get_firebase_users()
    return {"users": users}
