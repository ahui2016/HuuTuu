from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import model, forms, crud
from .database import engine, SessionLocal


model.Base.metadata.create_all(bind=engine)

app = FastAPI()


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/create-label', response_model=forms.Label)
def create_label(label: forms.LabelCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label_by_name(db, label.name)
    if db_label:
        raise HTTPException(
            status_code=400, detail=f'Label ({label.name}) already registered')
    return crud.create_label(db, label)
