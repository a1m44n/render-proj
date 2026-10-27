// Minimal zero-dependency Node.js web server for Render (Docker runtime).
const http = require("http");
const fs = require("fs");
const path = require("path");

// Render injects PORT (defaults to 10000). Must bind to 0.0.0.0.
const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const startedAt = Date.now();

function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": MIME[".json"] });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health check endpoint (used by Render's healthCheckPath)
  if (url.pathname === "/health") {
    return sendJSON(res, 200, { status: "ok" });
  }

  // Simple JSON API endpoint
  if (url.pathname === "/api/info") {
    return sendJSON(res, 200, {
      message: "Hello from Docker on Render!",
      node: process.version,
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      environment: process.env.NODE_ENV || "development",
      instance: process.env.RENDER_INSTANCE_ID || "local",
      commit: process.env.RENDER_GIT_COMMIT || "meow",
    });
  }

  // Static files
  const filePath = path.normalize(
    path.join(PUBLIC_DIR, url.pathname === "/" ? "index.html" : url.pathname)
  );
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendJSON(res, 403, { error: "Forbidden" });
  }

  fs.readFile(filePath, (err, content) => {
    if (err) return sendJSON(res, 404, { error: "Not found" });
    const type = MIME[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown (Render sends SIGTERM on deploys)
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  server.close(() => process.exit(0));
});
