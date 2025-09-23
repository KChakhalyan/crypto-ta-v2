from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://crypto:crypto@db:5432/crypto_ta"
    BINANCE_API_KEY: str = "YPiLXf5NGEGsspGajEJvInPSLrfW9vOROZLFHrVtfOMbzz6rq24V0RqOOLnVPZ7m"
    BINANCE_SECRET_KEY: str = "io28xgq3yGUYqywPAnzc3OdyPl5JvNNoJluLSsiWGdZkaW4cWqQ03Zw9wC7DOuNl"

    class Config:
        env_file = ".env"

settings = Settings()
