import { expect, type Page } from '@playwright/test';

export const server = process.env.BASE_URL ?? 'http://localhost:8081';
export const user = 'Developer';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'designer';
const pmv = 'case-map-test-project';

export class CaseMapEditor {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async openCaseMap(page: Page, options?: { readonly?: boolean }) {
    const serverUrl = server.replace(/^https?:\/\//, '');

    let url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}`;

    if (options) {
      url += `${this.params(options)}`;
    }

    return this.openUrl(page, url);
  }

  static async openMock(page: Page, options?: { readonly?: boolean; app?: string }) {
    let params = '';
    if (options) {
      params = '?';
      params += this.params(options);
    }
    return this.openUrl(page, `/mock.html${params}`);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new CaseMapEditor(page);
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return editor;
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
