from app.services.validation import is_valid_package_name

def test_valid_package_names():
    assert is_valid_package_name("nginx")
    assert is_valid_package_name("python3")
    assert is_valid_package_name("libssl3")
    assert is_valid_package_name("g++")


def test_invalid_package_names():
    assert not is_valid_package_name(";rm-rf")
    assert not is_valid_package_name("nginx && whoami")
    assert not is_valid_package_name("")
    assert not is_valid_package_name("../secret")