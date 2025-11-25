# AI-Assisted Document Authoring & Generation Platform

This project is a full-stack AI-powered application that helps users generate  
business documents (DOCX/PPTX) using LLMs, refine them, and export final versions.

## 🚀 Features
- User Authentication (JWT)
- Create Projects (.docx or .pptx)
- Default sections for both formats
- AI content generation using Gemini API
- AI-based refinement
- Reorder sections (up/down)
- Like/Dislike feedback
- Commenting + Version History
- Export to DOCX and PPTX
- Responsive React Frontend
- FastAPI Backend
- SQLite database

## 🛠 Tech Stack
### Frontend
- React + Vite  
- TailwindCSS  
- Axios  

### Backend
- FastAPI  
- SQLite  
- python-docx & python-pptx  
- Google Generative AI (Gemini)  

## 🔧 Environment Variables
Create a `.env` file in the **backend** folder with:
GEMINI_API_KEY=your_api_key_here
SECRET_KEY=your_fastapi_secret
DATABASE_URL=sqlite:///./app.db
LLM_PROVIDER=gemini


## ▶️ Run Locally

### Backend
cd backend
uvicorn app.main:app --reload


### Frontend
cd frontend
npm install
npm run dev


## 📦 Exporting Files
Click **Export .docx** or **Export .pptx** on the Project Page.

## 📽 Demo Video Requirements (As per assignment)
Your demo must show:
- Register + Login
- Create Word project
- Create PPT project
- AI generation
- Refinement
- Likes/Dislikes
- Version history
- Export DOCX/PPTX

## 📁 Project Structure
ai-doc-authoring/
backend/
frontend/

## 👩‍💻 Author
**Sahejpreet Kaur**


