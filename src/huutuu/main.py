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


@app.post('/get-label-by-name', response_model=forms.Label)
def get_label_by_name_without_records(
        label: forms.LabelCreate, db: Session = Depends(get_db)):
    return get_label_by_name(label, db)


@app.post('/get-label-by-name-with-records', response_model=forms.LabelWithRecords)
def get_label_by_name_with_records(
        label: forms.LabelCreate, db: Session = Depends(get_db)):
    return get_label_by_name(label, db)


def get_label_by_name(label: forms.LabelCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label_by_name(db, label.name)
    if not db_label:
        raise HTTPException(
            status_code=404, detail=f'Label Not Found: {label.name}')
    return db_label


@app.post('/create-record', response_model=forms.Record)
def create_record(record: forms.RecordCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label(db, record.label_id)
    if not db_label:
        raise HTTPException(
            status_code=404, detail=f'Label ID Not Found: {record.label_id}')
    return crud.create_record(db, record)


@app.get('/all-records', response_model=list[forms.Record])
def get_all_records(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_records(db, skip=skip, limit=limit)


@app.get('/all-labels', response_model=list[forms.Label])
def get_all_records(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_labels(db, skip=skip, limit=limit)
