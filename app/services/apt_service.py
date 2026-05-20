import subprocess
from typing import List

class AptCommandError(Exception):
    pass

def run_command(command: List[str]) -> str:
    """
    Runs a system command safely without shell=True.
    Returns stdout as a string.
    Raises AptCommandError if the command fails.
    """

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )

        return result.stdout.strip()
    except subprocess.CalledProcessError as error:
        raise AptCommandError(error.stderr.strip() or str(error))
    except subprocess.TimeoutExpired:
        raise AptCommandError("Command timed out")
    
def get_package_policy(package_name: str) -> dict:
    output = run_command(["apt-cache", "policy", package_name])

    installed_version: Optional[str] = None
    candidate_version: Optional[str] = None

    for line in output.splitlines():
        line = line.strip()

        if line.startswith("Installed:"):
            installed_version = line.replace("Installed:", "").strip()
        if line.startswith("Candidate:"):
            candidate_version = line.replace("Candidate:", "").strip()

    is_installed = installed_version not in [None, "(none)"]
    is_upgradable = (
        is_installed
        and candidate_version not in [None, "(none)"]
        and installed_version != candidate_version
    )

    return {
        "name": package_name,
        "installed_version": installed_version,
        "candidate_version": candidate_version,
        "is_installed": is_installed,
        "is_upgradable": is_upgradable,
    }

def get_package_dependencies(package_name: str) -> List[str]:
    output = run_command(["apt-cache", "depends", package_name])

    dependencies = []

    for line in output.splitlines():
        line = line.strip()

        if line.startswith("Depends:"):
            dependency = line.replace("Depends:", "").strip()
            dependencies.append(dependency)

    return dependencies

def get_upgradable_packages() -> List[dict]:
    output = run_command(["apt", "list", "--upgradable"])

    packages = []

    for line in output.splitlines():
        line = line.strip()

        if not line:
            continue

        if line.startswith("Listing"):
            continue

        if "/" not in line:
            continue

        parts = line.split()

        if len(parts) < 3:
            continue

        name = parts[0].split("/", 1)[0]
        new_version = parts[1]
        architecture = parts[2]

        current_version = None

        if "upgradable from:" in line.lower():
            marker = "upgradable from:"
            lower_line = line.lower()
            marker_index = lower_line.find(marker)

            if marker_index != -1:
                current_version = line[marker_index + len(marker):]
                current_version = current_version.replace("]", "").strip()

        packages.append(
            {
                "name": name,
                "current_version": current_version,
                "new_version": new_version,
                "architecture": architecture,
            }
        )

    return packages