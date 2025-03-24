
# Main Etrypoint 
# RTHA
#
# Created by Morgan on 03/01/2025
import firebase_admin
import os
import services.firebase 
import re

from fastapi import FastAPI, HTTPException, Query
from models.request import Medication, Frequency, Setting, Appointment, EmergencyContact, Notification
from firebase_admin import credentials, firestore
from pydantic import BaseModel
from typing import List

from sendTwilio import send_sms

# Get Firestore database reference
current_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(current_dir, "firebaseServiceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)

try:
    db = firestore.client()
except Exception as e:
    print(f"Firestore client initialization failed: {e}")
    
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


@app.put("/medication/update/list")
def update_medication(medications: List[Medication], user_id: str):
    try:
        medications_ref = db.collection("medications")
        for medication in medications:
            query = (
                medications_ref
                .where("user_id", "==", user_id)
                .where("id", "==", medication.id)
                .limit(1)
                .stream()
            )

            medication_doc = next(query, None)

            if medication_doc:
                # Update the document
                medication_doc.reference.update(medication.model_dump())
            else:
                # Add new medication if not found
                medications_ref.add(medication.model_dump())

        return {"code": 0, "message": "Medications updated successfully!"}

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


@app.put("/medication/frequency/update/list")
def update_medication_frequency_list(frequencies: List[Frequency], user_id: str):
    try:
        frequencies_ref = db.collection("frequencies")
        for frequency in frequencies:
            query = (
                frequencies_ref
                .where("user_id", "==", user_id)
                .where("id", "==", frequency.id)
                .limit(1)
                .stream()
            )

            frequency_doc = next(query, None)

            if frequency_doc:
                # Update the existing document
                frequency_doc.reference.update(frequency.model_dump())
            else:
                # Add new frequency if not found
                frequencies_ref.add(frequency.model_dump())

        return {"code": 0, "message": "Frequencies updated successfully!"}

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


@app.put("/appointment/list")
def update_appointment_list(appointments: List[Appointment], user_id: str):
    try:
        appointments_ref = db.collection("appointments")
        for appointment in appointments:
            query = (
                appointments_ref
                .where("user_id", "==", user_id)
                .where("id", "==", appointment.id)
                .limit(1)
                .stream()
            )

            appointment_doc = next(query, None)

            if appointment_doc:
                # Update the existing appointment
                appointment_doc.reference.update(appointment.model_dump())
            else:
                # Add new appointment if not found
                appointments_ref.add(appointment.model_dump())

        return {"code": 0, "message": "Appointments updated successfully!"}

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
        emergencies_ref = db.collection("emergencies")
        
        # Check if the emergency contact exists using user_id and id
        query = (
            emergencies_ref
            .where("user_id", "==", emergency.user_id)
            .where("id", "==", emergency.id)
            .limit(1)
            .stream()
        )

        emergency_doc = next(query, None)
        emergency_data = emergency.model_dump()

        if emergency_doc:
            # Update existing emergency contact
            emergency_doc.reference.update(emergency_data)
            return {"code": 0, "message": "Emergency contact updated successfully!"}
        else:
            # Add new emergency contact if not found
            doc_ref = emergencies_ref.add(emergency_data)
            return {"code": 1, "message": "Emergency contact not found, so it was added.", "document_id": doc_ref[1].id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/emergency/contact/update/list")
def update_emergency_list(emergencies: List[EmergencyContact], user_id: str):
    try:
        emergencies_ref = db.collection("emergencies")
        for emergency in emergencies:
            # Check if the emergency contact exists using user_id and id
            query = (
                emergencies_ref
                .where("user_id", "==", user_id)
                .where("id", "==", emergency.id)
                .limit(1)
                .stream()
            )

            emergency_doc = next(query, None)
            emergency_data = emergency.model_dump()

            if emergency_doc:
                # Update existing emergency contact
                emergency_doc.reference.update(emergency_data)
            else:
                # Add new emergency contact if not found
                emergencies_ref.add(emergency_data)

        return {"code": 0, "message": "Emergency contacts updated successfully!"}

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
            emergency_doc = next(query, None)
            if emergency_doc:
                emergency_doc.reference.delete()
                deleted_count += 1

        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="No matching emergencies found to delete.")

        return {"code": 0, "message": f"{deleted_count} emergencies deleted successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/notification/{user_id}")
def get_notification_list(user_id: str):
    try:
        notifications_ref = db.collection("notifications").where("user_id", "==", user_id).stream()
        notifications = [doc.to_dict() for doc in notifications_ref]
        if not notifications:
            return {"code": 0, "message": "No notifications found", "data": []}

        return {"code": 0, "data": notifications}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.put("/notification/update")
def update_notification(notification: Notification):
    try:
        notification_data = notification.model_dump()
        doc_ref = db.collection("notifications").add(notification_data)

        return {"code": 0, "document_id": doc_ref[1].id}    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.put("/notification/update/list")
def update_notification_list(notifications: List[Notification], user_id: str):
    try:
        notifications_ref = db.collection("notifications")
        for notification in notifications:
            notification_data = notification.model_dump()
            doc_ref = notifications_ref.add(notification_data)

        return {"code": 0, "message": "Notifications updated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_phone_number(phone: str) -> str:
    cleaned = re.sub(r"[^\d]", "", phone)  # Remove all non-numeric characters
    return f"+{cleaned}"  # Add the '+' sign



class EmergencyRequest(BaseModel):
    emergencyData: List[str]
    currentAddress: List[str]
@app.post("/sendEmergency")
def send_emergency(data: EmergencyRequest):
    try:
        if data.currentAddress[0]:
            message_body = f"A human is in danger. Location: {data.currentAddress}, Please help me." 
        else:
            message_body = f"A human is in danger. Please help me." 
        # Loop through each phone number and send SMS
        responses = []
        for phone in data.emergencyData:
            formatted_phone = format_phone_number(phone)  # Convert to +E.164 format
            response = send_sms(formatted_phone, message_body)
            responses.append(response)
        # Check if all messages were sent successfully
        failed_messages = [res for res in responses if res["code"] != 0]

        if failed_messages:
            return {
                "code": 1,
                "message": len(failed_messages),
                "details": failed_messages
            }
        return {"code": 0, "message": len(responses)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))