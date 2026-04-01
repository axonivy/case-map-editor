import { expect, type Locator, type Page } from '@playwright/test';
import type { Stage } from './Stage';

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

  async dndTo(target: Process | Stage) {
    await this.process.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(100, 100);
    if (target instanceof Process) {
      await target.process.hover();
    } else {
      await target.stage.hover({ position: { x: 10, y: 10 } });
    }
    await this.page.mouse.up();
  }
}
