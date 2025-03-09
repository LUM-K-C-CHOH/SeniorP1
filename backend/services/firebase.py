from firebase_admin import auth
from models.response import User
from typing import List

def get_firebase_users() -> List[User]:
  users: List[User] = []
  try:
      page = auth.list_users()
      while page:
          for user in page.users:
              m_user = User(
                  email = user.email,
                  id = user.uid
              )
              users.append(m_user)
              
          page = page.get_next_page()
  except Exception as e:
      print(f"Error listing users: {e}")
  
  return users