async function handleSubmit(e) {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const data =
      await apiRequest(
        "/auth/login",
        {
          method: "POST",

          body: JSON.stringify({
            email,
            password
          })
        }
      );

    localStorage.setItem(
      "spa_token",
      data.token
    );

    localStorage.setItem(
      "spa_user",
      JSON.stringify(data.user)
    );

    window.location.href =
      "/admin/dashboard";
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
