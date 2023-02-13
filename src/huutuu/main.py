from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from . import model, api
from .database import engine


model.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount('/public', StaticFiles(directory='src/public'), name='public')
app.include_router(api.router)


@app.get('/')
def homepage():
    return RedirectResponse('/public/index.html')


