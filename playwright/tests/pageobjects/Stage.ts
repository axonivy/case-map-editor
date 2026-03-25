import { expect, type Locator, type Page } from '@playwright/test';
import { Process } from './Process';

export class Stage {
  protected readonly page: Page;
  public readonly stage: Locator;
  public readonly addProcess: Locator;
  readonly delete: Locator;
  readonly deleteProcess: Locator;

  constructor(page: Page, parent: Locator, nth: number) {
    this.page = page;
    this.stage = parent.locator('[data-element-type="stage"]').nth(nth);
    this.addProcess = this.stage.getByRole('button', { name: 'Add Process' });
    this.delete = this.stage.getByRole('button', { name: 'Delete Stage (Delete)' });
    this.deleteProcess = this.stage.getByRole('button', { name: 'Delete Process' });
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
    await expect(this.stage).toHaveAttribute('data-selected', 'true');
  }

  async expectProcesses(count: number) {
    await expect(this.stage.locator('[data-element-type="process"]')).toHaveCount(count);
  }

  async expectSidesteps(count: number) {
    await expect(this.stage.locator('[data-element-type="sidestep"]')).toHaveCount(count);
  }
}
