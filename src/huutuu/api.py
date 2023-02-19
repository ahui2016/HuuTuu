import arrow
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import model, forms, crud
from .database import get_db


router = APIRouter(prefix='/api', tags=['api'])


@router.post('/create-label', response_model=forms.Label)
def create_label(label: forms.LabelCreate, db: Session = Depends(get_db)):
    db_label = crud.get_label_by_name(db, label.name)
    if db_label:
        raise HTTPException(
            status_code=400, detail=f'Label ({label.name}) already registered')
    return crud.create_label(db, label)


@router.post('/update-label', response_model=forms.Label)
def update_label(label: forms.Label, db: Session = Depends(get_db)):
    return crud.update_label(db, label)


@router.get('/get-label-by-id', response_model=forms.Label)
def get_label_by_id_without_records(label_id: int, db: Session = Depends(get_db)):
    db_label = db.get(model.Label, label_id)
    if not db_label:
        raise HTTPException(
            status_code=404, detail=f'Label ID Not Found: {label_id}')
    return db_label


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


@router.get('/get-record', response_model=forms.RecordWithLabel)
def get_record_by_id(record_id: int, db: Session = Depends(get_db)):
    db_record = db.get(model.Record, record_id)
    if not db_record:
        raise HTTPException(
            status_code=404, detail=f'Record ID Not Found: {record_id}')
    return db_record


@router.post('/create-record', response_model=forms.RecordWithLabel)
def create_record(record: forms.RecordCreate, db: Session = Depends(get_db)):
    return crud.create_record(db, record)


@router.post('/update-record', response_model=forms.RecordWithLabel)
def update_record(record: forms.Record, db: Session = Depends(get_db)):
    return crud.update_record(db, record)


@router.get('/all-records', response_model=list[forms.RecordWithLabel])
def get_all_records(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_records(db, skip=skip, limit=limit)


@router.get('/records-days', response_model=list[forms.DateAmount])
def get_records_days(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    records = crud.get_all_records(db, skip=skip, limit=limit)
    records_days: dict[str, forms.DateAmount] = {}
    for record in records:
        day = arrow.get(record.dt).format('YYYY-MM-DD')
        if day in records_days:
            records_days[day].amount += record.amount
            records_days[day].labels.add(record.label.name)
        else:
            item = forms.DateAmount(
                date=day, amount=record.amount, labels=[record.label.name])
            records_days[day] = item

    # 字典已排序 (Python 的特性)
    return list(records_days.values())


@router.get('/all-labels', response_model=list[forms.Label])
def get_all_labels(
        skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_labels(db, skip=skip, limit=limit)
