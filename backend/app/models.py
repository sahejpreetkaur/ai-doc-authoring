# app/models.py
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    main_topic = Column(String)
    doc_type = Column(String, nullable=False)  # 'docx' | 'pptx'

    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    sections = relationship(
        "Section",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="Section.order"
    )


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False, default=0)

    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)

    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)

    # List of revision objects:
    # [{ "timestamp": "...", "prompt": "...", "old": "...", "new": "...", "user_id": 1 }]
    history = Column(JSON, default=list)

    project = relationship("Project", back_populates="sections")
    comments = relationship(
        "Comment",
        back_populates="section",
        cascade="all, delete-orphan"
    )


class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)

    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id"))

    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    section = relationship("Section", back_populates="comments")
