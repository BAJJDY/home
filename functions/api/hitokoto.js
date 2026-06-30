const API_SECRET = "BAJJDY_API_SECRET_KEY_2026_06_15";

const verifyToken = (token, time, path) => {
  if (!token || !time) return false;
  const now = Date.now();
  if (Math.abs(now - parseInt(time)) > 5 * 60 * 1000) return false;
  const raw = `${path}|${time}|${API_SECRET}`;
  let expected = "";
  for (let i = 0; i < raw.length; i++) {
    expected += String.fromCharCode(raw.charCodeAt(i) ^ API_SECRET.charCodeAt(i % API_SECRET.length));
  }
  const expectedEncoded = btoa(expected).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return token === expectedEncoded;
};

export async function onRequestGet(context) {
  const { request } = context;
  const token = request.headers.get("x-request-token");
  const time = request.headers.get("x-request-time");

  if (!verifyToken(token, time, "/api/hitokoto")) {
    return new Response("403 Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const response = await fetch("https://international.v1.hitokoto.cn", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return new Response("API error", { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("API error", { status: 500 });
  }
}