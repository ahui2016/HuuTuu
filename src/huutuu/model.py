from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class Record(Base):
    __tablename__ = "record"

    # 時間戳
    id: Mapped[int] = mapped_column(primary_key=True)

    # 時間戳
    dt    : Mapped[int] = mapped_column(index=True)
    
    # 支出金額
    amount: Mapped[int]

    # 备注
    notes : Mapped[str]

    # 標籤
    label_id: Mapped[int] = mapped_column(ForeignKey('label.id'))
    label: Mapped['Label'] = relationship(back_populates='records')


class Label(Base):
    __tablename__ = "label"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)
    records: Mapped[list['Record']] = relationship(back_populates='label')
