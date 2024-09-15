# external
from fastapi import APIRouter, Request

# internal
from api.samples.io import CreateWritingSampleInput

samples_router: APIRouter = APIRouter(prefix="/samples")

@samples_router.post("/create")
async def create_samples(request: Request, input: CreateWritingSampleInput):
    return {"message": "This is the create samples endpoint"}


@samples_router.post("/update")
async def update_samples():
    return {"message": "This is the update samples endpoint"}


@samples_router.post("/delete")
async def delete_samples():
    return {"message": "This is the delete samples endpoint"}