// Frontend server (Bun, no dependencies).
//  - serves ./public
//  - exposes /config.js (API base URL)
//  - proxies /api/* to the Spring Boot backend at http://localhost:8081,
//    so the browser sees ONE origin and the backend needs no CORS configuration.
import { resolve, sep } from "node:path";

const PORT = Number(process.env.PORT ?? 3000);
// Target Spring Boot backend explicitly at http://localhost:8081
const BACKEND_URL = "http://localhost:8081";
const API_BASE_URL = "/api";
const PUBLIC_DIR = resolve(import.meta.dir, "public");

async function forward(targetBase: string, req: Request, url: URL, body?: ArrayBuffer): Promise<Response> {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("keep-alive");

  const target = targetBase + url.pathname + url.search;
  return await fetch(target, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });
}

async function proxy(req: Request, url: URL): Promise<Response> {
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let res: Response | null = null;
  let lastErr: any = null;

  // 1. Primary target: http://localhost:8081
  try {
    res = await forward(BACKEND_URL, req, url, body);
  } catch (err: any) {
    lastErr = err;
    // 2. Fallback to 127.0.0.1 if localhost resolution encounters issues
    try {
      res = await forward("http://127.0.0.1:8081", req, url, body);
    } catch (fallbackErr) {
      lastErr = fallbackErr;
    }
  }

  if (!res) {
    console.error(`[Proxy 502] Failed to reach backend at ${BACKEND_URL}:`, lastErr?.message || lastErr);
    return Response.json(
      { message: `Cannot reach backend at ${BACKEND_URL}. Is Spring Boot running?`, error: String(lastErr?.message || lastErr) },
      { status: 502 },
    );
  }

  const out = new Headers(res.headers);
  out.delete("content-encoding");
  out.delete("content-length");
  out.delete("transfer-encoding");
  out.delete("connection");
  return new Response(res.body, { status: res.status, headers: out });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/config.js") {
      return new Response(`window.APP_CONFIG = ${JSON.stringify({ API_BASE_URL })};`, {
        headers: { "content-type": "application/javascript", "cache-control": "no-store" },
      });
    }

    if (url.pathname.startsWith("/api/")) return proxy(req, url);

    const target = resolve(PUBLIC_DIR, "." + decodeURIComponent(url.pathname));
    if (target.startsWith(PUBLIC_DIR + sep)) {
      const file = Bun.file(target);
      if (await file.exists()) return new Response(file);
    }
    return new Response(Bun.file(resolve(PUBLIC_DIR, "index.html")));
  },
});

console.log(`Maximize Motors Dealership CRM: http://localhost:${PORT}  ->  backend ${BACKEND_URL}`);
