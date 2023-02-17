from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import forms, crud
from .database import get_db


router = APIRouter(prefix='/api', tags=['api'])


@router.post('/create-label', response_model=forms.Label)
def create_label(label: forms.LabelCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label_by_name(db, label.name)
    if db_label:
        raise HTTPException(
            status_code=400, detail=f'Label ({label.name}) already registered')
    return crud.create_label(db, label)


@router.post('/get-label-by-name', response_model=forms.Label)
def get_label_by_name_without_records(
        label: forms.LabelCreate, db: Session = Depends(get_db)):
    return get_label_by_name(label, db)


@router.post('/get-label-by-name-with-records', response_model=forms.LabelWithRecords)
def get_label_by_name_with_records(
        label: forms.LabelCreate, db: Session = Depends(get_db)):
    return get_label_by_name(label, db)


def get_label_by_name(label: forms.LabelCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label_by_name(db, label.name)
    if not db_label:
        raise HTTPException(
            status_code=404, detail=f'Label Not Found: {label.name}')
    return db_label


@router.post('/create-record', response_model=forms.RecordWithLabel)
def create_record(record: forms.RecordCreate, db: Session = Depends(get_db)):
    return crud.create_record(db, record)


@router.get('/all-records', response_model=list[forms.Record])
def get_all_records(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_records(db, skip=skip, limit=limit)


@router.get('/all-labels', response_model=list[forms.Label])
def get_all_labels(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_labels(db, skip=skip, limit=limit)
