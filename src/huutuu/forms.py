from pydantic import BaseModel


class RecordBase(BaseModel):
    dt    : int       # 時間戳
    amount: int = 0   # 支出金額
    notes : str = ''  # 备注


class RecordCreate(RecordBase):
    pass


class Record(RecordBase):
    id: int
    label_id: int

    class Config:
        orm_mode = True


class LabelBase(BaseModel):
    name: str


class LabelCreate(LabelBase):
    pass


class Label(LabelBase):
    id: int
    records: list[Record] = []

    class Config:
        orm_mode = True
