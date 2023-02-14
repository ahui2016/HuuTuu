from typing import Sequence

import arrow
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import model, forms


First_Label_ID = 1


# https://docs.sqlalchemy.org/en/20/orm/queryguide/select.html#selecting-individual-attributes
def get_labels_next_id(db: Session) -> int:
    row = db.execute(
        select(model.Label.id).order_by(model.Label.id.desc())
        ).first()
    if not row:
        return First_Label_ID
    return row.id + 1


def get_label_by_name(db: Session, name: str) -> model.Label | None:
    return db.scalar(
        select(model.Label).where(model.Label.name == name))

'''
def get_label(db: Session, label_id: int) -> model.Label | None:
    return db.get(model.Label, label_id)
'''

def create_label(db: Session, label: forms.LabelCreate) -> model.Label:
    label_id = get_labels_next_id(db)
    db_label = model.Label(id=label_id, dt=now(), name=label.name)
    db.add(db_label)
    db.commit()
    return db_label


def create_record(db: Session, record: forms.RecordCreate) -> model.Record:
    dt = now()
    db_record = model.Record(**record.dict(), id=dt, dt=dt)
    db.add(db_record)
    db.flush()

    if not db_record.label:
        raise HTTPException(
            status_code=404, detail=f'Label ID Not Found: {record.label_id}')

    db_record.label.dt = dt
    db.commit()
    return db_record


def get_all_records(
        db: Session, skip: int = 0, limit: int = 100
) -> Sequence[model.Record]:
    return db.scalars(select(model.Record).offset(skip).limit(limit)).all()


def get_all_labels(
        db: Session, skip: int = 0, limit: int = 100
) -> Sequence[model.Label]:
    return db.scalars(select(model.Label)
        .order_by(model.Label.dt.desc())
        .offset(skip)
        .limit(limit)
    ).all()


def now() -> int:
    return arrow.now().int_timestamp