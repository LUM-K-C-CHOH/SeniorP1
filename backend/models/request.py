# Request Models 
# RTHA
#
# Created by Thornton on 03/02/2025

from pydantic import BaseModel
from typing import List, Optional

class Setting(BaseModel):
  user_id: str
  push: str
  theme: str
  font: str

class Medication(BaseModel):
  id: int
  user_id: str
  name: str
  image: str
  stock: int
  start_date: str
  end_date: str
  threshold: int
  push_alert: str
  email_alert: str
  
class Frequency(BaseModel):
  id: int
  medication_id: int
  user_id: str
  dosage: int
  dosage_unit: int
  cycle: int
  times: List[str]

class Appointment(BaseModel):
  id: int
  user_id: str
  name: str
  phone: str
  image: str
  scheduled_time: str
  description: str
  location: str

class Notification(BaseModel):
  id: int
  user_id: str
  type: int
  var1: str
  var2: str
  var3: str
  status: int
  target_id: int

class EmergencyContact(BaseModel):
  id: int
  user_id: str
  name: str
  phone: str
  image: str
  type: str