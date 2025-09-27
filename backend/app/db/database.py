# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# import os

# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "postgresql+psycopg2://crypto:crypto@db:5432/crypto_ta"
# )

# engine = create_engine(DATABASE_URL, echo=False)

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# # dependency для FastAPI
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# backend/app/db/database.py
# backend/app/db/database.py

# backend/app/db/database.py
# backend/app/db/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# создаём движок
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    future=True,
)

# фабрика асинхронных сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# базовый класс для моделей
Base = declarative_base()

# зависимость для FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

