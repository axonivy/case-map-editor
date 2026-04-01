import { expect, type Locator, type Page } from '@playwright/test';
import { Palette } from './Palette';

export class Toolbar {
  protected readonly page: Page;
  readonly locator: Locator;
  readonly detailToggle: Locator;
  readonly undo: Locator;
  readonly redo: Locator;
  readonly palette: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.ui-toolbar');
    this.detailToggle = this.locator.getByRole('button', { name: 'Details' });
    this.palette = this.locator.locator('.palette-section');
    this.undo = this.locator.getByRole('button', { name: 'Undo' });
    this.redo = this.locator.getByRole('button', { name: 'Redo' });
  }

  async openPalette(name: 'Processes') {
    await expect(async () => {
      const paletteBtn = this.locator.getByRole('button', { name });
      await expect(paletteBtn).toHaveAttribute('data-state', 'closed');
      await paletteBtn.click();
      await expect(paletteBtn).toHaveAttribute('data-state', 'open');
    }).toPass({ intervals: [100, 100, 100] });
    return new Palette(this.page);
  }
}
