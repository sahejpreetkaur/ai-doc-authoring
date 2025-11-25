import os
from dotenv import load_dotenv


load_dotenv()


# support both names in case .env uses GEMINI_API_KEY
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


if not GOOGLE_API_KEY:
    raise Exception("GOOGLE_API_KEY is missing! Check .env file (or GEMINI_API_KEY).")


# model selection: use a model that works for your account
# leave defaults — if you change model, update MODEL_NAME and API_VERSION
MODEL_NAME = "models/gemini-2.5-flash"
API_VERSION = "v1"