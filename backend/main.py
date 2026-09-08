from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, auth, chat, climate, community, dashboard, digital_twin, satellite, water, weather

app = FastAPI(
    title="JalRakshak AI API",
    description="Hyperlocal Water Intelligence & Climate-Risk Prediction for Agriculture",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https://.*\.vercel\.app$|^http://localhost:3000$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(water.router)
app.include_router(climate.router)
app.include_router(digital_twin.router)
app.include_router(community.router)
app.include_router(satellite.router)
app.include_router(chat.router)
app.include_router(admin.router)
app.include_router(weather.router)


@app.get("/")
def root():
    return {"service": "JalRakshak AI API", "status": "healthy", "tagline": "Predict. Preserve. Prosper."}


@app.get("/health")
def health():
    return {"status": "ok"}
