import re

PACKAGE_NAME_PATTERN = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9+.-]*$")

def is_valid_package_name(package_name: str) -> bool:
    return bool(PACKAGE_NAME_PATTERN.fullmatch(package_name))