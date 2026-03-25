import { expect, type Locator, type Page } from '@playwright/test';

export class Process {
  protected readonly page: Page;
  public readonly process: Locator;

  constructor(page: Page, parent: Locator, type: 'process' | 'sidestep', nth: number) {
    this.page = page;
    this.process = parent.locator(`[data-element-type="${type}"]`).nth(nth);
  }
  async expectName(name: string) {
    await expect(this.process).toContainText(name);
  }

  async inscribe() {
    await this.process.dblclick();
    await this.expectSelected();
  }

  async expectSelected() {
    await expect(this.process).toHaveAttribute('data-selected', 'true');
  }
}
