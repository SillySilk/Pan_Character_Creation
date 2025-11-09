// Download Helper Utility
// Provides functions for downloading files from the browser

export interface DownloadOptions {
  filename: string
  mimeType?: string
}

/**
 * Download text content as a file
 */
export function downloadTextFile(content: string, options: DownloadOptions): void {
  const { filename, mimeType = 'text/plain' } = options

  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, filename)
}

/**
 * Download JSON content as a file
 */
export function downloadJSON(data: any, filename: string): void {
  const content = JSON.stringify(data, null, 2)
  downloadTextFile(content, {
    filename: filename.endsWith('.json') ? filename : `${filename}.json`,
    mimeType: 'application/json'
  })
}

/**
 * Download HTML content as a file
 */
export function downloadHTML(html: string, filename: string): void {
  downloadTextFile(html, {
    filename: filename.endsWith('.html') ? filename : `${filename}.html`,
    mimeType: 'text/html'
  })
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename

  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Open content in a new window for printing
 */
export function openPrintWindow(html: string, title: string = 'Print'): void {
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    alert('Please allow popups to print the character sheet')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}

/**
 * Generate a safe filename from a character name
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}
