# WSGI module for use with Apache mod_wsgi or gunicorn

from mapproxy.wsgiapp import make_wsgi_app
from logging.config import fileConfig
from base64 import b64decode
import os

class BasicAuth():
  def __init__(self, app):
    self._app = app

  def __call__(self, environ, start_response):
    if self._authenticated(environ.get('HTTP_AUTHORIZATION')):
      return self._app(environ, start_response)
    return self._login(environ, start_response)

  def _authenticated(self, header):
    if not header:
      return False

    _, encoded = header.split(None, 1)
    decoded = b64decode(encoded).decode('UTF-8')
    username, password = decoded.split(':', 1)

    envUsername = os.environ['MAPPROXY_USERNAME']
    envPassword = os.environ['MAPPROXY_PASSWORD']

    return envUsername == username and envPassword == password

  def _login(self, environ, start_response):
    start_response('403 Forbidden',
      [('Content-Type', 'text/html'), ('WWW-Authenticate', 'Basic realm="Login"')])
    return

fileConfig(r'/mapproxy/log.ini', {'here': os.path.dirname(__file__)})

application = make_wsgi_app(r'/mapproxy/mapproxy.yaml', reloader=True)
application = BasicAuth(application)
