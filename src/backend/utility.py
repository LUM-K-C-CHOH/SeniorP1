import os
from twilio.rest import Client
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To

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

def send_email(to_email: str, html_content: str):
    api_key = os.getenv("SENDGRID_API_KEY")
    message = Mail(
        from_email = "noreply@ntro.io",
        to_emails = to_email,
        subject = "Medication Replenishment Alert",
        is_multiple = True,
        html_content = html_content
    )
    
    try:
        sg = SendGridAPIClient(api_key)
        sg.send(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False