const API_URL =
  "https://spadodoguinho.com.br/api";

function isFormDataBody(body) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiRequest(
  path,
  options = {}
) {
  const token =
    localStorage.getItem("spa_token");

  const { headers: customHeaders = {}, ...fetchOptions } = options;
  const shouldSendJsonHeader = !isFormDataBody(fetchOptions.body);

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...fetchOptions,

      headers: {
        ...(shouldSendJsonHeader
          ? {
              "Content-Type":
                "application/json"
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`
            }
          : {}),

        ...customHeaders
      }
    }
  );

  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "Erro na requisição"
    );
  }

  return data;
}
