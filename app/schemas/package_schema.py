from pydantic import BaseModel
from typing import List, Optional

class PackageInfo(BaseModel):
    name: str
    installed_version: Optional[str]
    candidate_version: Optional[str]
    is_installed: bool
    is_upgradable: bool

class PackageDependencies(BaseModel):
    name: str
    dependencies: List[str]

class UpgradeablePackage(BaseModel):
    name: str
    current_version: Optional[str]
    new_version: Optional[str]