async function register(email, username, password) {
  const res = await fetch("http://localhost:8000/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password })
  });
  return res.json();
}

module.exports = { register };
