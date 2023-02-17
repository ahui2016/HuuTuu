from pydantic import BaseModel


class RecordBase(BaseModel):
    amount  : int       # 支出金額
    notes   : str = ''  # 备注
    label_id: int


class RecordCreate(RecordBase):
    pass


class Record(RecordBase):
    id: int  # 時間戳
    dt: int  # 時間戳

    class Config:
        orm_mode = True


class LabelBase(BaseModel):
    name: str


class LabelCreate(LabelBase):
    pass


class Label(LabelBase):
    id: int  # 自增
    dt: int  # 時間戳

    class Config:
        orm_mode = True


class LabelWithRecords(LabelBase):
    id: int  # 自增
    dt: int  # 時間戳
    records: list[Record] = []

    class Config:
        orm_mode = True


class RecordWithLabel(RecordBase):
    id: int  # 時間戳
    dt: int  # 時間戳
    label: Label

    class Config:
        orm_mode = True
