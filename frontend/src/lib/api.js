const API_URL =
  "https://spadodoguinho.com.br/api";

export async function apiRequest(
  path,
  options = {}
) {
  const token =
    localStorage.getItem("spa_token");

  const response = await fetch(
    `${API_URL}${path}`,
    {
      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`
            }
          : {})
      },

      ...options
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Erro na requisição"
    );
  }

  return data;
}
