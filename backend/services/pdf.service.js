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
          @page {
            margin: 100px 40px 80px 40px;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
          }
          .container {
            padding: 0 40px;
          }

          img {
            max-width: 100%;
          }

          h1 {
            margin-bottom: 20px;
          }

          pre {
            background: #0f172a;
            color: #e5e7eb;
            padding: 12px;
            overflow-x: auto;
          }

          ul, ol {
            padding-left: 24px;
          }

          p, li {
            page-break-inside: avoid;
          }

          h1, h2, h3 {
            page-break-after: avoid;
          }
        .banner {
          display: block;
          margin: 20px auto 30px auto; 
          max-height: 140px;             
          object-fit: contain;   
        }
        </style>
      </head>
      <body>
    
        <img class="banner" src="https://res.cloudinary.com/df0l3m8ef/image/upload/v1772669046/header-l-removebg-preview_xriirs.png" />

        <div class="container">
          <h1>${title}</h1>
          ${html}
        </div>
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
