import { expect, type Locator, type Page } from '@playwright/test';
import { Stage } from './stage';

export class Flow {
  protected readonly page: Page;
  public readonly locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.case-map-flow');
  }

  stageByNth(nth: number) {
    return new Stage(this.page, this.locator, nth);
  }

  async expectStages(count: number) {
    await expect(this.locator.locator('.stage-tile')).toHaveCount(count);
  }
}
