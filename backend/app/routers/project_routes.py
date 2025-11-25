# app/routers/project_routes.py
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import SessionLocal
from app.models import Project, Section, Comment
from app.auth_utils import get_current_user
from app.llm_client import LLMClient
from app.utils.export_utils import assemble_docx, assemble_pptx
import logging, time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["Projects"])


# ----------------------------- DB DEPENDENCY ----------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------- Pydantic Models --------------------------------

class ProjectCreate(BaseModel):
    name: str
    main_topic: str
    doc_type: str


class ProjectUpdate(BaseModel):
    name: str | None = None
    main_topic: str | None = None
    doc_type: str | None = None


llm = LLMClient()


# ----------------------------- CREATE PROJECT ---------------------------------

@router.post("/")
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    proj = Project(
        name=payload.name,
        main_topic=payload.main_topic,
        doc_type=payload.doc_type,
        user_id=user_id
    )

    db.add(proj)
    db.commit()
    db.refresh(proj)

    # Default sections
    if payload.doc_type == "docx":
        default_sections = [
            ("Introduction", 1),
            ("Problem Statement", 2),
            ("Methodology", 3),
            ("Results", 4),
            ("Conclusion", 5),
        ]
    else:
        default_sections = [
            ("Title Slide", 1),
            ("Problem Slide", 2),
            ("Key Insights", 3),
            ("Graph Slide", 4),
            ("Conclusion Slide", 5),
        ]

    for title, order in default_sections:
        sec = Section(
            project_id=proj.id,
            title=title,
            order=order,
            content=""
        )
        db.add(sec)

    db.commit()
    return proj


# ----------------------------- UPDATE PROJECT (NEW) ----------------------------

@router.put("/{project_id}")
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    proj = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not proj:
        raise HTTPException(404, "Project not found")

    if payload.name is not None:
        proj.name = payload.name
    if payload.main_topic is not None:
        proj.main_topic = payload.main_topic
    if payload.doc_type is not None:
        proj.doc_type = payload.doc_type

    db.commit()
    db.refresh(proj)
    return proj


# ----------------------------- DELETE PROJECT (NEW) ----------------------------

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    proj = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not proj:
        raise HTTPException(404, "Project not found")

    # Cascade deletes all sections + comments
    db.delete(proj)
    db.commit()

    return {"message": "Project deleted"}


# ----------------------------- LIST PROJECTS ----------------------------------

@router.get("/")
def list_projects(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return db.query(Project).filter(Project.user_id == user_id).all()


# ----------------------------- GET PROJECT ------------------------------------

@router.get("/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    proj = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not proj:
        raise HTTPException(404, "Project not found")

    sections = db.query(Section).filter(
        Section.project_id == project_id
    ).order_by(Section.order).all()

    proj.sections = sections
    return proj


# ----------------------------- ADD SECTION ------------------------------------

@router.post("/{project_id}/sections")
def add_section(
    project_id: int,
    title: str = Query(...),
    order: int = Query(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not project:
        raise HTTPException(404, "Project not found")

    if order is None:
        order = db.query(Section).filter(
            Section.project_id == project_id
        ).count() + 1

    sec = Section(
        project_id=project_id,
        title=title,
        order=order,
        content=""
    )
    db.add(sec)
    db.commit()
    db.refresh(sec)

    return sec


# ----------------------------- UPDATE SECTION ---------------------------------

@router.put("/{project_id}/sections/{section_id}")
def update_section(
    project_id: int,
    section_id: int,
    title: str = None,
    content: str = None,
    order: int = None,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    sec = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not sec:
        raise HTTPException(404, "Section not found")

    if title is not None:
        sec.title = title
    if content is not None:
        sec.content = content
    if order is not None:
        sec.order = order

    db.commit()
    db.refresh(sec)

    return sec


# ----------------------------- DELETE SECTION ---------------------------------

@router.delete("/{project_id}/sections/{section_id}")
def delete_section(
    project_id: int,
    section_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    sec = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not sec:
        raise HTTPException(404, "Section not found")

    db.delete(sec)
    db.commit()

    return {"message": "Deleted"}


# ----------------------------- GENERATE CONTENT -------------------------------

@router.post("/{project_id}/generate")
def generate_content(
    project_id: int,
    section_id: int = None,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not project:
        raise HTTPException(404, "Project not found")

    if section_id:
        sections = db.query(Section).filter(
            Section.project_id == project_id,
            Section.id == section_id
        ).all()
    else:
        sections = db.query(Section).filter(
            Section.project_id == project_id
        ).all()

    for sec in sections:
        try:
            generated = llm.generate(project.main_topic, sec.title)
        except:
            generated = "Content could not be generated. Try refining this section."

        sec.history = (sec.history or []) + [{
            "timestamp": time.time(),
            "action": "generate",
            "prompt": f"generate {sec.title}",
            "old": sec.content,
            "new": generated,
            "user_id": user_id
        }]

        sec.content = generated

    db.commit()
    return {"message": "Generated"}


# ----------------------------- REFINE SECTION ---------------------------------

@router.post("/{project_id}/sections/{section_id}/refine")
def refine_section(
    project_id: int,
    section_id: int,
    instruction: str = Query(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    sec = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not sec:
        raise HTTPException(404, "Section not found")

    old = sec.content or ""

    try:
        refined = llm.refine(old, instruction)
    except:
        refined = "Refining failed. Try changing the instruction."

    sec.history = (sec.history or []) + [{
        "timestamp": time.time(),
        "action": "refine",
        "prompt": instruction,
        "old": old,
        "new": refined,
        "user_id": user_id
    }]

    sec.content = refined
    db.commit()
    db.refresh(sec)
    return sec


# ----------------------------- FEEDBACK ---------------------------------------

@router.post("/{project_id}/sections/{section_id}/feedback")
def feedback(
    project_id: int,
    section_id: int,
    like: bool = Query(...),
    comment: str = Query(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    sec = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not sec:
        raise HTTPException(404, "Section not found")

    if like:
        sec.likes = (sec.likes or 0) + 1
    else:
        sec.dislikes = (sec.dislikes or 0) + 1

    if comment:
        c = Comment(section_id=section_id, user_id=user_id, text=comment)
        db.add(c)

    db.commit()
    return {"likes": sec.likes, "dislikes": sec.dislikes}


# ----------------------------- HISTORY ----------------------------------------

@router.get("/{project_id}/history")
def get_history(
    project_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    sections = db.query(Section).filter(
        Section.project_id == project_id
    ).all()

    return [{
        "section_id": s.id,
        "title": s.title,
        "history": s.history or []
    } for s in sections]


# ----------------------------- EXPORT -----------------------------------------

@router.get("/{project_id}/export")
def export_project(
    project_id: int,
    format: str = Query("docx"),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not project:
        raise HTTPException(404, "Project not found")

    sections = db.query(Section).filter(
        Section.project_id == project_id
    ).order_by(Section.order).all()

    if format == "docx":
        return assemble_docx(project, sections)
    if format == "pptx":
        return assemble_pptx(project, sections)

    raise HTTPException(400, "Invalid format")
# ----------------------------- MOVE SECTION ---------------------------------

@router.post("/{project_id}/sections/{section_id}/move")
def move_section(
    project_id: int,
    section_id: int,
    direction: str = Query(..., regex="^(up|down)$"),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    """
    Swap the order of the current section with the section above or below it.
    """
    sec = db.query(Section).join(Project).filter(
        Section.id == section_id,
        Project.id == project_id,
        Project.user_id == user_id
    ).first()

    if not sec:
        raise HTTPException(404, "Section not found")

    # Determine neighbor
    target_order = sec.order - 1 if direction == "up" else sec.order + 1

    neighbor = db.query(Section).filter(
        Section.project_id == project_id,
        Section.order == target_order
    ).first()

    if not neighbor:
        # already at top or bottom
        return {"message": "No swap possible"}

    # Swap order values
    sec.order, neighbor.order = neighbor.order, sec.order

    db.commit()
    return {"message": "reordered"}
