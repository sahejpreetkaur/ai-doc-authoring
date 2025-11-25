import os
from google.genai import Client

class LLMClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            print("[LLM WARNING] No GEMINI_API_KEY found; using mock mode.")
            self.mock = True
            return

        self.mock = False
        self.client = Client(api_key=api_key)

    def generate(self, main_topic: str, section_title: str):
        if self.mock:
            return "[Mock] Missing API key."

        prompt = (
            f"Write a detailed, well-structured section titled '{section_title}' "
            f"for a business document on '{main_topic}'. Ensure clarity, depth "
            f"and professional tone."
        )

        try:
            result = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return result.text
        except Exception as e:
            return f"[LLM ERROR] {str(e)}"

    def refine(self, original_text: str, instruction: str):
        if self.mock:
            return f"{original_text}\n\n[Mock refine: {instruction}]"

        prompt = (
            f"Refine the following text according to this instruction:\n"
            f"{instruction}\n\n"
            f"Text:\n{original_text}"
        )

        try:
            result = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return result.text
        except Exception as e:
            return f"[LLM ERROR] {str(e)}"
