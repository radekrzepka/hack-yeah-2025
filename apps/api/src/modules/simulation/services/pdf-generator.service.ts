import { Injectable, Logger } from "@nestjs/common";
import puppeteer, { Browser, Page } from "puppeteer";

interface GeneratePdfOptions {
  tokenId: string;
  frontendUrl?: string;
}

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);
  private browser: Browser | null = null;

  async generatePensionReport({
    tokenId,
    frontendUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  }: GeneratePdfOptions): Promise<Buffer> {
    this.logger.log(`Generating PDF report for token: ${tokenId}`);
    const dashboardUrl = `${frontendUrl}/dashboard/${tokenId}`;
    let page: Page | null = null;
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2,
      });
      this.logger.log(`Navigating to dashboard: ${dashboardUrl}`);
      await page.goto(dashboardUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      await page.waitForSelector('[data-testid="retirement-dashboard"]', {
        timeout: 10000,
      });
      this.logger.log("Page loaded successfully, waiting for charts...");
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            // @ts-expect-error - document is available in browser context via Puppeteer
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const charts = document.querySelectorAll("canvas");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (charts.length > 0) {
              clearInterval(checkInterval);
              setTimeout(() => {
                resolve();
              }, 1000);
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
          }, 5000);
        });
      });
      this.logger.log("Generating PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
        preferCSSPageSize: true,
      });
      this.logger.log("PDF generated successfully");
      return Buffer.from(pdfBuffer);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error generating PDF: ${errorMessage}`);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      this.logger.log("Launching new browser instance...");
      const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
      };
      if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        this.logger.log(
          `Using custom Chromium path: ${process.env.PUPPETEER_EXECUTABLE_PATH}`,
        );
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        launchOptions.args = [
          ...(launchOptions.args || []),
          "--disable-software-rasterizer",
          "--no-zygote",
          "--single-process",
        ];
      } else {
        this.logger.log("Using Puppeteer's bundled Chrome");
      }
      this.browser = await puppeteer.launch(launchOptions);
    }
    return this.browser;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      this.logger.log("Closing browser instance...");
      await this.browser.close();
    }
  }
}
