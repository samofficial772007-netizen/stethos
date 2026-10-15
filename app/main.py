
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Stethos API")

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def home():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
def health():
    return {"status": "ok", "project": "Stethos"}


@app.post("/api/test-audio")
async def test_audio(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".wav"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a WAV audio file."
        )

    audio_bytes = await file.read()

    if len(audio_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Audio file must be 10 MB or smaller."
        )

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Audio file is empty.")

    return {
        "filename": file.filename,
        "size_bytes": len(audio_bytes),
        "message": "WAV upload received successfully. ML analysis is not connected yet."
    }
