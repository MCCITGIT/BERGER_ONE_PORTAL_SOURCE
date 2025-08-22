import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import {
  fileURLToPath
} from 'node:url'
import {
  getCurrentConfig
} from './ssr.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get configuration for current environment
const config = getCurrentConfig()
const isProduction = process.env.NODE_ENV === 'production'

// Base URL configuration
const BASE_URL = '/BERGERONE'

// Cached production assets
let templateHtml = ''
if (isProduction) {
  try {
    templateHtml = await fs.readFile('./dist/client/index.html', 'utf-8')
  } catch (error) {
    console.error('Failed to read template HTML:', error)
  }
}

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const {
    createServer
  } = await import('vite')
  vite = await createServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom',
    base: config.base,
  })
  app.use(vite.middlewares)
} else {
  // Production middleware
  try {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default

    if (config.compression) {
      app.use(compression())
    }

    // Serve static assets from dist/client
    app.use(config.base, sirv('./dist/client', {
      extensions: [],
      dev: false,
      etag: config.caching,
      maxAge: config.maxAge
    }))

    // Serve CSS files specifically
    app.use('/src/styles', express.static(path.join(__dirname, 'dist/client/src/styles')))

    // Serve other static assets
    app.use('/vite.svg', express.static(path.join(__dirname, 'dist/client/vite.svg')))
  } catch (error) {
    console.error('Failed to load production middleware:', error)
  }
}

// Serve HTML with SSR
app.use(/(.*)/, async (req, res) => {
  try {
    // Handle the base URL properly
    let url = req.originalUrl;

    // Check if URL starts with BASE_URL
    if (!url.startsWith(BASE_URL)) {
      // If it's a static asset request (favicon.ico, etc.), return 404
      if (url.includes('.') || url === '/favicon.ico') {
        return res.status(404).send('Not found');
      }

      // For all other requests, redirect to add BASE_URL prefix
      const redirectUrl = `${BASE_URL}${url}`;
      console.log('Redirecting:', url, '→', redirectUrl);
      return res.redirect(301, redirectUrl);
    }

    // Keep the full URL including /BERGERONE for routing
    // Don't remove the prefix - pass it as is to the router

    // Debug logging
    console.log('Original URL:', req.originalUrl);
    console.log('Processed URL:', url);
    console.log('Config base:', config.base);

    /** @type {string} */
    let template
    /** @type {import('./dist/server/entry-server.js').render} */
    let render

    if (!isProduction) {
      // Development mode
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      // Production mode
      template = templateHtml

      // Fix asset paths for production
      template = template
        .replace(/\.\/src\//g, '/src/')
        .replace(/\.\/vite\.svg/g, '/vite.svg')

      try {
        render = (await import('./dist/server/entry-server.js')).render
      } catch (error) {
        console.error('Failed to load SSR render function:', error)
        return res.status(500).send('SSR render function not available')
      }
    }

    if (!render) {
      return res.status(500).send('Render function not available')
    }

    const rendered = await render(url)

    if (!rendered || !rendered.html) {
      return res.status(500).send('Failed to render page')
    }

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({
      'Content-Type': 'text/html'
    }).send(html)
  } catch (e) {
    if (vite) {
      vite.ssrFixStacktrace(e)
    }
    console.error('SSR Error:', e)
    res.status(500).send(`
      <html>
        <body>
          <h1>Server Error</h1>
          <p>An error occurred during server-side rendering.</p>
          ${!isProduction ? `<pre>${e.stack}</pre>` : ''}
        </body>
      </html>
    `)
  }
})

// Start http server
app.listen(config.port, () => {
  console.log(`🚀 Berger One Portal SSR Server Started`)
  console.log(`📱 Mode: ${isProduction ? 'Production' : 'Development'}`)
  console.log(`🌐 URL: http://localhost:${config.port}`)
  console.log(`🔧 Base: ${config.base}`)
  console.log(`⚡ SSR: ${config.ssrEnabled ? 'Enabled' : 'Disabled'}`)
  console.log(`🗜️  Compression: ${config.compression ? 'Enabled' : 'Disabled'}`)
  console.log(`💾 Caching: ${config.caching ? 'Enabled' : 'Disabled'}`)
})