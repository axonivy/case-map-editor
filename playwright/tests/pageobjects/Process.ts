import { expect, type Locator, type Page } from '@playwright/test';

export class Process {
  protected readonly page: Page;
  public readonly process: Locator;

  constructor(page: Page, parent: Locator, type: 'process' | 'sidestep', nth: number) {
    this.page = page;
    this.process = parent.locator(`.${type}-tile`).nth(nth);
  }
  async expectName(name: string) {
    await expect(this.process.locator('.process-tile-name')).toHaveText(name);
  }

  async inscribe() {
    await this.process.dblclick();
    await this.expectSelected();
  }

  async expectSelected() {
    await expect(this.process).toHaveClass(/selected/);
  }
}
