document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const result = await window.api.register(email, username, password);

  console.log(result);
};
