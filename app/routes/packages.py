from fastapi import APIRouter, HTTPException

from app.schemas.package_schema import PackageInfo, PackageDependencies
from app.services.apt_service import (
    AptCommandError,
    get_package_policy,
    get_package_dependencies
)
from app.services.validation import is_valid_package_name

router = APIRouter(prefix="/packages", tags=["Packages"])

@router.get("/{package_name}", response_model=PackageInfo)
def read_package(package_name: str):
    if not is_valid_package_name(package_name):
        raise HTTPException(status_code=400, detail="Invalid package name")
    try:
        return get_package_policy(package_name)
    except AptCommandError as error:
        raise HTTPException(status_code=500, detail=str(error))
    
@router.get("/{package_name}/dependencies", response_model=PackageDependencies)
def read_package_dependencies(package_name: str):
    if not is_valid_package_name(package_name):
        raise HTTPException(status_code=400, detail="Invalid package name")
    try:
        dependencies = get_package_dependencies(package_name)

        return {
            "name": package_name,
            "dependencies": dependencies,
        }
    except AptCommandError as error:
        raise HTTPException(status_code=500, detail=str(error))