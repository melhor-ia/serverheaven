from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from mangum import Mangum

from api.app import app as fastapi_app
from core.firebase import initialize_firebase

# Initialize Firebase Admin SDK
# This needs to be done once per runtime
initialize_firebase()

# Set global options for all functions
set_global_options(max_instances=10)

# Create a handler for our FastAPI app
handler = Mangum(fastapi_app, lifespan="off")

# Expose the FastAPI app as an HTTPS function
@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    """
    Main Firebase Function that serves the FastAPI application via Mangum.
    All incoming requests to this function are handled by the FastAPI app.
    """
    return handler(req)