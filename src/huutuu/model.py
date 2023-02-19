from pathlib import Path

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


CWD = Path.cwd().resolve()
PhotosFolderPath = CWD.joinpath('src', 'public', 'photos')


class Metadata(Base):
    __tablename__ = 'metadata'
    name: Mapped[str] = mapped_column(primary_key=True)
    val_str: Mapped[str] = ''
    val_int: Mapped[int] = 0


class Record(Base):
    __tablename__ = 'record'

    # 時間戳
    id: Mapped[int] = mapped_column(primary_key=True)

    # 時間戳
    dt: Mapped[int] = mapped_column(index=True)
    
    # 支出金額
    amount: Mapped[int]

    # 备注
    notes: Mapped[str]

    # 標籤
    label_id: Mapped[int] = mapped_column(ForeignKey('label.id'))
    label: Mapped['Label'] = relationship(back_populates='records')


class Label(Base):
    __tablename__ = 'label'

    id: Mapped[int] = mapped_column(primary_key=True)  # 自增
    dt: Mapped[int] = mapped_column(index=True)        # 時間戳
    name: Mapped[str] = mapped_column(unique=True)
    records: Mapped[list[Record]] = relationship(back_populates='label')
