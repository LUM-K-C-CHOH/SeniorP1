import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
def send_sms(to_phone: str, message_body: str):
    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=to_phone
        )
        print(f"Message sent! SID: {message.sid}", message_body)
        return {"code": 0, "message": "SMS sent successfully", "sid": message.sid}
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return {"code": 1, "message": str(e)}