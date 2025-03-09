
# Main Etrypoint 
# RTHA
#
# Created by Thornton on 03/01/2025
import firebase_admin
import os
import services.firebase 

from fastapi import FastAPI, HTTPException, Query
from models.request import Medication, Frequency, Setting, Appointment, EmergencyContact
from firebase_admin import credentials, firestore
from pydantic import BaseModel
# Get Firestore database reference
current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, "firebaseServiceAccountKey.json")
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

db = firestore.client()
app = FastAPI()

@app.get("/")
def root():
    users = services.firebase.get_firebase_users()

    return {"users": users}

@app.get("/medication/{user_id}")
def get_medication_list(user_id: str):
    try:
        medications_ref = db.collection("medications").where("user_id", "==", user_id).stream()
        
        medications = [doc.to_dict() for doc in medications_ref]
        if not medications:
            return {"code": 0, "message": "No medications found", "data": []}

        return {"code": 0, "data": medications}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/medication/add")
def add_medication(medication: Medication):
    try:
        medication_data = medication.model_dump()
        print(medication_data)
        doc_ref = db.collection("medications").add(medication_data)

        return {"code": 0, "document_id": doc_ref[1].id}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/medication/update")
def update_medication(medication: Medication):
    try:
        medications_ref = db.collection("medications")
        query = (
            medications_ref
            .where("user_id", "==", medication.user_id)
            .where("id", "==", medication.id)
            .limit(1)
            .stream()
        )

        medication_doc = next(query, None)

        if medication_doc:
            # Update the document
            medication_doc.reference.update(medication.model_dump())
            return {"code": 0, "message": "Medication updated successfully!"}
        else:
            # Add new medication if not found
            medications_ref.add(medication.model_dump())
            return {"code": 1, "message": "Medication not found, so it was added."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/medication/{user_id}/{medication_id}")
def delete_medication(user_id: str, medication_id: int):
    try:
        # Query Firestore to find the correct document
        medications_ref = db.collection("medications")
        query = medications_ref.where("user_id", "==", user_id).where("id", "==", medication_id).limit(1).stream()

        medication_doc = next(query, None)
        if not medication_doc:
            raise HTTPException(status_code=404, detail="Medication not found")

        # Delete the document
        medication_doc.reference.delete()

        return {"code": 0, "message": "Medication deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/medication/frequency/{user_id}")
def get_frequency_list(user_id: str):
    try:
        frequencies_ref = db.collection("frequencies").where("user_id", "==", user_id).stream()
        
        frequencies = [doc.to_dict() for doc in frequencies_ref]
        if not frequencies:
            return {"code": 0, "message": "No frequencies found", "data": []}

        return {"code": 0, "data": frequencies}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/medication/frequency/add")
def add_frequency(frequency: Frequency):
    try:
        frequency_data = frequency.model_dump()
        print(frequency_data)
        doc_ref = db.collection("frequencies").add(frequency_data)

        return {"code": 0, "document_id": doc_ref[1].id}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/medication/frequency/update")
def update_medication_frequency(frequency: Frequency):
    try:
        frequencies_ref = db.collection("frequencies")
        query = (
            frequencies_ref
            .where("user_id", "==", frequency.user_id)
            .where("id", "==", frequency.id)
            .limit(1)
            .stream()
        )

        frequency_doc = next(query, None)

        if frequency_doc:
            # Update the existing document
            frequency_doc.reference.update(frequency.model_dump())
            return {"code": 0, "message": "Frequency updated successfully!"}
        else:
            # Add new frequency if not found
            frequencies_ref.add(frequency.model_dump())
            return {"code": 1, "message": "Frequency not found, so it was added."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/medication/frequency/{user_id}/{frequency_id}")
def delete_frequency(user_id: str, frequency_id: int):
    try:
        # Query Firestore to find the correct document
        frequencies_ref = db.collection("frequencies")
        query = frequencies_ref.where("user_id", "==", user_id).where("id", "==", frequency_id).limit(1).stream()

        frequency_doc = next(query, None)
        if not frequency_doc:
            raise HTTPException(status_code=404, detail="frequency not found")

        # Delete the document
        frequency_doc.reference.delete()

        return {"code": 0, "message": "frequency deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    

@app.get("/appointment/{user_id}")
def get_appointment_list(user_id: str):
    try:
        appointments_ref = db.collection("appointments").where("user_id", "==", user_id).stream()
        
        appointments = [doc.to_dict() for doc in appointments_ref]
        if not appointments:
            return {"code": 0, "message": "No appointments found", "data": []}

        return {"code": 0, "data": appointments}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/appointment")
def add_appointment(appointment: Appointment):
    try:
        appointment_data = appointment.model_dump()
        print(appointment_data)
        doc_ref = db.collection("appointments").add(appointment_data)

        return {"code": 0, "document_id": doc_ref[1].id}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/appointment")
def update_appointment(appointment: Appointment):
    try:
        appointments_ref = db.collection("appointments")
        query = (
            appointments_ref
            .where("user_id", "==", appointment.user_id)
            .where("id", "==", appointment.id)
            .limit(1)
            .stream()
        )

        appointment_doc = next(query, None)

        if appointment_doc:
            # Update the existing appointment
            appointment_doc.reference.update(appointment.model_dump())
            return {"code": 0, "message": "Appointment updated successfully!"}
        else:
            # Add new appointment if not found
            appointments_ref.add(appointment.model_dump())
            return {"code": 1, "message": "Appointment not found, so it was added."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/appointment/{user_id}/{appointment_id}")
def delete_appointment(user_id: str, appointment_id: int):
    try:
        # Query Firestore to find the correct document
        appointments_ref = db.collection("appointments")
        query = appointments_ref.where("user_id", "==", user_id).where("id", "==", appointment_id).limit(1).stream()

        appointment_doc = next(query, None)
        if not appointment_doc:
            raise HTTPException(status_code=404, detail="appointment not found")

        # Delete the document
        appointment_doc.reference.delete()

        return {"code": 0, "message": "appointment deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    


@app.get("/user/setting/{user_id}")
def get_setting_list(user_id: str):
    try:
        settings_ref = db.collection("settings").where("user_id", "==", user_id).stream()
        
        settings = [doc.to_dict() for doc in settings_ref]
        print(settings)
        if not settings:
            return {"code": 0, "message": "No settings found", "data": []}

        return {"code": 0, "data": settings}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/user/setting")
def update_setting(setting: Setting):
    try:
        settings_ref = db.collection("settings")

        # Query to find the document
        query = (
            settings_ref
            .where("user_id", "==", setting.user_id)
            .limit(1)
            .stream()
        )

        setting_doc = next(query, None)

        if setting_doc:
            # Update the existing setting
            setting_doc.reference.update(setting.model_dump())
            return {"code": 0, "message": "Setting updated successfully!"}
        else:
            # Add new setting if not found
            _, doc_ref = settings_ref.add(setting.model_dump())
            return {"code": 1, "message": "Setting not found, so it was added.", "document_id": doc_ref.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/emergency/contact/{user_id}")
def get_emergency_list(user_id: str):
    try:
        emergencies_ref = db.collection("emergencies").where("user_id", "==", user_id).stream()
        emergencies = [doc.to_dict() for doc in emergencies_ref]
        if not emergencies:
            return {"code": 0, "message": "No emergencies found", "data": []}

        return {"code": 0, "data": emergencies}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.put("/emergency/contact/update")
def update_emergency(emergency: EmergencyContact):
    try:
        emergency_data = emergency.model_dump()
        doc_ref = db.collection("emergencies").add(emergency_data)

        return {"code": 0, "document_id": doc_ref[1].id}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
class EmergencyDeleteRequest(BaseModel):
    contactList: str
@app.delete("/emergency/contact/{user_id}")
def delete_emergency(user_id: str, request: EmergencyDeleteRequest):
    try:
        # Convert the contactList string to a list of IDs
        emergency_ids = request.contactList.split(",")
        emergencies_ref = db.collection("emergencies")
        deleted_count = 0
        for emergency_id in emergency_ids:
            emergency_id = int(emergency_id)
            query = (
                emergencies_ref
                .where("user_id", "==", user_id)
                .where("id", "==", emergency_id)
                .limit(1)
                .stream()
            )
            print(query)
            emergency_doc = next(query, None)
            print(emergency_doc)
            if emergency_doc:
                emergency_doc.reference.delete()
                deleted_count += 1

        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="No matching emergencies found to delete.")

        return {"code": 0, "message": f"{deleted_count} emergencies deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    