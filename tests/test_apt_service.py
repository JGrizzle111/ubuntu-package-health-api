from app.services.apt_service import get_package_policy


def test_get_package_policy_parses_versions(monkeypatch):
    fake_output = """
nginx:
  Installed: 1.24.0-2ubuntu7
  Candidate: 1.24.0-2ubuntu7.1
  Version table:
     1.24.0-2ubuntu7.1 500
"""

    def fake_run_command(command):
        return fake_output

    monkeypatch.setattr(
        "app.services.apt_service.run_command",
        fake_run_command
    )

    result = get_package_policy("nginx")

    assert result["name"] == "nginx"
    assert result["installed_version"] == "1.24.0-2ubuntu7"
    assert result["candidate_version"] == "1.24.0-2ubuntu7.1"
    assert result["is_installed"] is True
    assert result["is_upgradable"] is True