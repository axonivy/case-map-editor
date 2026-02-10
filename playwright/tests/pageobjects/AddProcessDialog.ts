import { type Locator, type Page } from '@playwright/test';
import { Combobox, Input } from './Inscription';

export class AddProcessDialog {
  readonly page: Page;
  readonly locator: Locator;
  readonly process: Combobox;
  readonly name: Input;
  readonly create: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = this.page.getByRole('dialog');
    this.name = new Input(page, this.locator, 'Name');
    this.process = new Combobox(page, this.locator, 'Process');
    this.create = this.locator.getByRole('button', { name: 'Create Process' });
  }
}
