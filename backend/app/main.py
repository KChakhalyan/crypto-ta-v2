from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pairs, analyze, reports
from app.routers import analysis  # добавляем
from app.db import models, database
from app.routers import ws


# создаём таблицы, если их нет (на старте)
models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(title="Crypto TA API")
app.include_router(ws.router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

# Подключаем новые роутеры
app.include_router(pairs.router)
app.include_router(analyze.router)
app.include_router(reports.router)
app.include_router(analysis.router) 

