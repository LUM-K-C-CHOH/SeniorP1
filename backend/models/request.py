# Request Modes 
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
  name: str
  stock: int
  startDate: str
  endDate: str
  threshold: int
  pushAlert: str
  emailAlert: str
  
class Frequency(BaseModel):
  id: int
  user_id: str
  dosage: int
  dosageUnit: int
  cycle: int
  times: List[str]

class Appointment(BaseModel):
  id: int
  user_id: str
  name: str
  phone: str
  image: str
  scheduledTime: str
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
  targetId: int

class EmergencyContact(BaseModel):
  id: int
  user_id: str
  name: str
  phone: str
  image: str
  type: str