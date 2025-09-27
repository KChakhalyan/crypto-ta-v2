from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pairs, reports
from app.routers import analysis  # добавляем
from app.db import models, database
from app.routers import ws


# создаём таблицы, если их нет (на старте)
# models.Base.metadata.create_all(bind=database.engine)


app = FastAPI(title="Crypto TA API")
app.include_router(ws.router)


@app.on_event("startup")
async def ensure_tables_exist() -> None:
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

# Подключаем новые роутеры
app.include_router(pairs.router)
app.include_router(reports.router)
app.include_router(analysis.router) 
