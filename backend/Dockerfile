FROM python:3.12-slim

# Установим зависимости для компиляции пакетов (psycopg2 и т.п.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Скопируем зависимости (чтобы кэшировались слои Docker)
COPY pyproject.toml poetry.lock* ./

# Установим poetry и зависимости
RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# Копируем проект
COPY . .

# Экспонируем порт для uvicorn
EXPOSE 8000

# CMD оставим как у тебя
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
