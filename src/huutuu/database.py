from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


Database_File = 'sqlite:///./huutuu.db'

engine = create_engine(Database_File, connect_args={'check_same_thread':False})
SessionLocal = sessionmaker(autoflush=False, bind=engine)


# https://fastapi.tiangolo.com/tutorial/sql-databases/
# https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Base(DeclarativeBase):
    pass
