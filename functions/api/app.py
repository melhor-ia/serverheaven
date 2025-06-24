from fastapi import FastAPI

app = FastAPI(
    title="ServerHeaven API",
    description="Backend for the ServerHeaven platform.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the ServerHeaven API!"} 