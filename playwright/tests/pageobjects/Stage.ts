import { expect, type Locator, type Page } from '@playwright/test';
import { Process } from './Process';

export class Stage {
  protected readonly page: Page;
  public readonly stage: Locator;
  public readonly title: Locator;
  public readonly addProcess: Locator;
  readonly delete: Locator;
  readonly deleteProcess: Locator;

  constructor(page: Page, parent: Locator, nth: number) {
    this.page = page;
    this.stage = parent.locator('[data-element-type="stage"]').nth(nth);
    this.title = this.stage.locator('.ui-stage-title');
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

  async dndTo(target: Stage) {
    await this.stage.hover({ position: { x: 10, y: 10 } });
    await this.page.mouse.down();
    await this.page.mouse.move(100, 100);
    await target.stage.hover();
    await this.page.mouse.up();
  }

  async expectProcessOrder(expected: Array<string>) {
    for (let i = 0; i < expected.length; i++) {
      await expect(this.processByNth(i).process).toHaveAttribute('aria-label', expected[i]!);
    }
  }
}
