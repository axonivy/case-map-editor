import { type Locator, type Page } from '@playwright/test';
import { Textbox } from './components/Textbox';
import { Combobox } from './Inscription';

export class AddStageDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly name: Textbox;
  readonly icon: Combobox;
  readonly cancel: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.name = new Textbox(this.locator, { name: 'Name' });
    this.icon = new Combobox(this.page, this.locator, 'Icon');
    this.cancel = this.locator.getByRole('button', { name: 'Cancel' });
    this.create = this.locator.getByRole('button', { name: 'Create Stage' });
  }
}
