export async function onRequestGet(context) {
  const { request } = context;
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  
  if (referer && !referer.includes(host) && !referer.includes("BAJJDY.top") && !referer.includes("localhost")) {
    return new Response(JSON.stringify({ code: 403, msg: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch("https://t.alcy.cc/ycy", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return new Response("Image fetch error", { status: 500 });
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Image fetch error", { status: 500 });
  }
}