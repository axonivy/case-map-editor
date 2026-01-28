import { type Locator, type Page } from '@playwright/test';
import { Textbox } from './components/Textbox';

export class AddStageDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly id: Textbox;
  readonly name: Textbox;
  readonly icon: Textbox;
  readonly cancel: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.id = new Textbox(this.locator, { name: 'Id' });
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.icon = new Textbox(this.locator, { name: 'Icon' });
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.create = this.locator.getByRole('button', { name: 'Create Stage' });
  }
}
