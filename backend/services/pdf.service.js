import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import puppeteer from "puppeteer";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

export function sanitize(html) {
  return purify.sanitize(html);
}

export function wrapHTML(title, html) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          img {
            max-width: 100%;
          }
          pre {
            background: #0f172a;
            color: #e5e7eb;
            padding: 12px;
          }
          code {
            font-family: monospace;
          }
          ul,
          ol {
            padding-left: 24px;
          }
        </style>
      </head>
      <body>
        <h1>CS Board User Guides</h1>
        <h1>${title}</h1>
        ${html}
      </body>
    </html>
  `;
}

export async function createPDF(html) {
  const isProduction = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch({
    executablePath: isProduction ? undefined : "/usr/bin/chromium",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
    ],
    timeout: 0,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}
