from firebase_admin import firestore
from fastapi import HTTPException
from models.request import Medication, Frequency

db = firestore.client()

def get_firebase_users():
    # Example function for getting Firebase users
    return ["user1", "user2"]
