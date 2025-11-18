from passlib.hash import bcrypt

def hash_password(password: str) -> str:
    """Hash a plain text password."""
    return bcrypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return bcrypt.verify(plain_password, hashed_password)
