from logging.config import fileConfig
from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import pool
import asyncio
import os, sys

# === Правильный путь до backend/app ===
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
APP_DIR = os.path.join(BASE_DIR, "app")

if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)
if APP_DIR not in sys.path:
    sys.path.append(APP_DIR)

# Теперь можно импортировать app.*
from app.core.config import settings
from app.db.database import Base
from app.db import models  # чтобы Alembic видел модели

# Alembic config
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Offline migrations."""
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Online migrations with async engine."""
    connectable = create_async_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
        future=True,
    )

    async def do_run_migrations():
        async with connectable.connect() as connection:
            await connection.begin()
            await connection.run_sync(
                lambda conn: context.configure(connection=conn, target_metadata=target_metadata)
            )
            await connection.run_sync(lambda conn: context.run_migrations())
            await connection.commit()

    asyncio.run(do_run_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
