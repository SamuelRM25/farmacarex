#!/usr/bin/env python3
"""Servidor estático con fallback SPA (rewrite de rutas desconocidas a index.html)."""
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        resolved = super().translate_path(path)
        if os.path.isdir(resolved):
            return resolved
        if not os.path.exists(resolved):
            # Ruta de app (SPA) -> index.html
            return os.path.join(ROOT, "index.html")
        return resolved

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


class ThreadedServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    with ThreadedServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        print(f"serving {ROOT} on http://127.0.0.1:{PORT}", flush=True)
        httpd.serve_forever()
