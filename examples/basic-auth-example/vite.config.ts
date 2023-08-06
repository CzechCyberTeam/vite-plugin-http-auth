import { defineConfig, loadEnv } from 'vite'
import httpAuth from 'vite-plugin-http-basic-auth'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return ({
    plugins: [httpAuth([{
      username:env.VITE_AUTH_USERNAME,
      password: env.VITE_AUTH_PASSWORD
    }], {
        realm: env.VITE_AUTH_REALM,
    })],
    build: {
      target: ['es2020']
    }
  })
})
