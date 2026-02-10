import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
  const indexContent = readFileSync(indexPath, 'utf-8');
  
  // Insert the redirect script before the closing </head> tag
  const redirectScript = `
    <script>
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser to the
      // root url with that new query string.
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
      
      // Handle direct route access on GitHub Pages
      // When GitHub Pages serves 404.html for a route, we need to preserve the path
      // This runs before React Router loads, so we modify the URL directly
      (function() {
        var path = window.location.pathname;
        // If we're on 404.html and not at root, we need to handle the redirect
        // The standard SPA redirect above handles query params, but we also need
        // to handle direct path access
        if (path !== '/' && path !== '/index.html' && path !== '/404.html') {
          // Store the path so React Router can navigate to it after the page loads
          var fullPath = path + window.location.search + window.location.hash;
          // Use history.replaceState to update the URL without reloading
          // This allows React Router to see the correct path
          window.history.replaceState(null, '', fullPath);
        }
      })();
    </script>
  `;
  
  // Insert the redirect script before </head>
  const notFoundContent = indexContent.replace('</head>', redirectScript + '\n  </head>');
  
  writeFileSync(notFoundPath, notFoundContent, 'utf-8');
  console.log('✓ Created 404.html for GitHub Pages');
} catch (error) {
  console.error('Error creating 404.html:', error);
  process.exit(1);
}

