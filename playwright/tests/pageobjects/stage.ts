import { expect, type Locator, type Page } from '@playwright/test';
import { Process } from './process';

export class Stage {
  protected readonly page: Page;
  public readonly stage: Locator;

  constructor(page: Page, parent: Locator, nth: number) {
    this.page = page;
    this.stage = parent.locator('.stage-tile').nth(nth);
  }

  processByNth(nth: number) {
    return new Process(this.page, this.stage, 'process', nth);
  }

  sidestepByNth(nth: number) {
    return new Process(this.page, this.stage, 'sidestep', nth);
  }

  async inscribe() {
    await this.stage.dblclick({ position: { x: 10, y: 10 } });
    await this.expectSelected();
  }

  async expectSelected() {
    await expect(this.stage).toHaveClass(/selected/);
  }

  async expectProcesses(count: number) {
    await expect(this.stage.locator('.process-tile')).toHaveCount(count);
  }

  async expectSidesteps(count: number) {
    await expect(this.stage.locator('.sidestep-tile')).toHaveCount(count);
  }
}
