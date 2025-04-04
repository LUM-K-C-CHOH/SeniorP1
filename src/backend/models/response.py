from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
  email: str
  id: str
  name: Optional[str] = None