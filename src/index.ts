import type {PluginOption} from 'vite';
import auth from 'basic-auth';

export default function vitePluginHttpBasicAuth(users: { username?: string, password: string }[],
                                                config?: {realm?: string, useInServer?: boolean, useInPreview?: boolean}): PluginOption {
  console.log(`Using vitePluginHttpAuth with ${users.length} users`)

  function authMiddleware(req, res, next) {
    const user = auth(req);
    if (!user || !user.name || !user.pass) {
      return unauthorized(res, config?.realm || 'Authentication required');
    }
    if (!users.find(u => u.username === user.name && u.password === user.pass)) {
      return unauthorized(res, config?.realm || 'Authentication required');
    }
    next();
  }

  return {
    name: 'vite-plugin-http-auth',
    enforce: 'pre',
    apply: 'serve',

    configureServer(server) {
       if (config?.useInServer === undefined || config?.useInServer)
         server.middlewares.use(authMiddleware);
    },

    configurePreviewServer(server) {
      if (config?.useInServer === undefined || config?.useInPreview)
        server.middlewares.use(authMiddleware);
    },
  }
}

function unauthorized(res, realm: string) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.end('Unauthorized');
}
