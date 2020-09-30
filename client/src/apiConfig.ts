const SERVER_PORT = process.env.NODE_ENV === 'development' ? 8085 : 80; // local : nginx
const CLIENT_PORT = process.env.NODE_ENV === 'development' ? 8082 : 80; // local : nginx

export const SERVER_URL = `http://localhost:${SERVER_PORT}`; // /api, /oidc, /interaction
export const CLIENT_URL = `http://localhost:${CLIENT_PORT}`; // /
export const NOMINATIM_URL = `http://localhost:${SERVER_PORT}/proxy/nominatim`;
export const GEOSERVER_URL = `http://localhost:${SERVER_PORT}/proxy/geoserver`;
export const MAPPROXY_URL = `http://localhost:${SERVER_PORT}/proxy/mapproxy`;
