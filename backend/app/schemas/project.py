from pydantic import BaseModel
from typing import List, Optional

class ProjectCreate(BaseModel):
    title: str
    doc_type: str
    main_topic: str
    structure: List[str]

class ProjectContentUpdate(BaseModel):
    section_index: int
    new_content: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    doc_type: str
    main_topic: str
    structure_json: str

    class Config:
        orm_mode = True
