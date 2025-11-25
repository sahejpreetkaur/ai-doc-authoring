import requests
from app.config import GOOGLE_API_KEY, MODEL_NAME, API_VERSION


API_URL = f"https://generativelanguage.googleapis.com/{API_VERSION}/{MODEL_NAME}:generateContent"




def call_gemini(prompt: str) -> str:
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
            ]
    }
    params = {"key": GOOGLE_API_KEY}
    resp = requests.post(API_URL, json=payload, params=params, timeout=60)
    data = resp.json()
    # helpful debug when something's wrong
    if resp.status_code != 200:
        raise Exception(f"Gemini API Error: status={resp.status_code} data={data}")


    if "candidates" not in data:
        raise Exception(f"Gemini API Error: unexpected response: {data}")
    return data["candidates"][0]["content"]["parts"][0]["text"]




def generate_section_content(main_topic: str, section_title: str) -> str:
    prompt = f"""
Generate professional structured content.


Main Topic: {main_topic}
Section: {section_title}
"""
    return call_gemini(prompt)




def refine_content(existing_text: str, instruction: str) -> str:
    prompt = f"""
Instruction: {instruction}


Original text:
{existing_text}


Rewrite professionally.
""" 
    return call_gemini(prompt)


