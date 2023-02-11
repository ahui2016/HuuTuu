from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


Database_File = 'sqlite:///./huutuu.db'

engine = create_engine(Database_File, connect_args={'check_same_thread':False})
SessionLocal = sessionmaker(autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
