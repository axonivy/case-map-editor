import { expect, type Locator, type Page } from '@playwright/test';
import { AddStageDialog } from './AddStageDialog';
import { Stage } from './Stage';

export class Flow {
  protected readonly page: Page;
  public readonly locator: Locator;
  readonly add: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.case-map-flow');
    this.add = this.locator.getByRole('button', { name: 'Add Stage (A)' });
  }

  stageByNth(nth: number) {
    return new Stage(this.page, this.locator, nth);
  }

  async expectStages(count: number) {
    await expect(this.locator.locator('.stage-tile')).toHaveCount(count);
  }

  public async openAddStageDialog() {
    await this.add.click();
    const dialog = new AddStageDialog(this.page);
    await expect(dialog.locator).toBeVisible();
    return dialog;
  }
}
