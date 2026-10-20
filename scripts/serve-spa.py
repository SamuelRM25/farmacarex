#!/usr/bin/env python3
"""Servidor estático con fallback SPA (rewrite a index.html) + endpoint de guardado
para el pipeline de recorte de fondo blanco (alpha-key)."""
import http.server
import os
import socketserver
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()
SAVE_DIR = os.environ.get("AD_SAVE_DIR", os.path.join(ROOT, "medicamentos", "alpha"))


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        resolved = super().translate_path(path)
        if os.path.isdir(resolved):
            return resolved
        if not os.path.exists(resolved):
            return os.path.join(ROOT, "index.html")
        return resolved

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/__save":
            self.send_error(404)
            return
        qs = urllib.parse.parse_qs(parsed.query)
        name = qs.get("name", [""])[0]
        if not name or "/" in name or ".." in name:
            self.send_error(400)
            return
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        os.makedirs(SAVE_DIR, exist_ok=True)
        target = os.path.join(SAVE_DIR, name)
        with open(target, "wb") as fh:
            fh.write(body)
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"ok")

    def log_message(self, fmt, *args):
        pass


class ThreadedServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    with ThreadedServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        print(f"serving {ROOT} on http://127.0.0.1:{PORT}", flush=True)
        print(f"saving posts to {SAVE_DIR}", flush=True)
        httpd.serve_forever()
