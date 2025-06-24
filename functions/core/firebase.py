import firebase_admin
from firebase_admin import credentials, firestore, auth
from . import settings

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK.
    """
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)

initialize_firebase()

db = firestore.client()
firebase_auth = auth 