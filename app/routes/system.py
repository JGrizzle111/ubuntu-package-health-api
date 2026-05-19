from fastapi import APIRouter, HTTPException

from app.services.apt_service import AptCommandError, get_upgradable_packages

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/upgradable")
def read_upgradable_packages():
    try:
        return {
            "packages": get_upgradable_packages()
        }
    except AptCommandError as error:
        raise HTTPException(status_code=500, detail=str(error))