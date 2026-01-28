import { expect, type Locator, type Page } from '@playwright/test';

export class Inscription {
  protected readonly page: Page;
  public readonly view: Locator;
  readonly help: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.locator('.case-map-editor-detail-panel');
    this.help = this.view.getByRole('button', { name: 'Open Help' });
  }

  get header() {
    return this.view.locator('.case-map-editor-detail-header');
  }

  collapsible(title: string) {
    return new Collapsible(this.page, this.view, title);
  }

  async expectHeader(title: string) {
    await expect(this.view.locator('.case-map-editor-detail-header')).toContainText(title);
  }
}

export class Collapsible {
  protected readonly page: Page;
  protected readonly collapsible: Locator;
  public readonly trigger: Locator;
  protected readonly control: Locator;
  protected readonly content: Locator;
  protected readonly state: Locator;

  constructor(page: Page, parent: Locator, title: string) {
    this.page = page;
    this.collapsible = parent.locator(`.ui-collapsible:has(.ui-collapsible-trigger:has-text("${title}"))`);
    this.trigger = this.collapsible.locator('.ui-collapsible-trigger');
    this.control = this.collapsible.locator('.ui-button');
    this.content = this.collapsible.locator('.ui-collapsible-content');
    this.state = this.collapsible.locator('.ui-state-dot');
  }

  input(label: string) {
    return new Input(this.page, this.content, label);
  }

  checkbox(label: string) {
    return new Checkbox(this.page, this.content, label);
  }

  combobox(label: string) {
    return new Combobox(this.page, this.content, label);
  }

  async toggleControl(nth?: number) {
    await this.control.nth(nth ? nth : 0).click();
  }

  async expectState(state: 'warning' | 'error' | undefined) {
    if (state) {
      await expect(this.state).toHaveAttribute('data-state', state);
    } else {
      await expect(this.state).toBeHidden();
    }
  }
}

export class Input {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    readonly parentLocator: Locator,
    label: string
  ) {
    this.locator = parentLocator.getByRole('textbox', { name: label }).first();
  }

  async focus() {
    if (!(await this.locator.isVisible())) {
      await this.locator.click();
    }
  }

  async blur() {
    if (await this.locator.isVisible()) {
      await this.locator.blur();
    }
  }

  async clear() {
    await this.focus();
    await this.locator.clear();
  }

  async fill(value: string) {
    await this.focus();
    await this.clear();
    await this.locator.fill(value);
    await this.locator.blur();
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectEmpty() {
    await this.focus();
    await expect(this.locator).toBeEmpty();
  }

  async selectText() {
    await this.focus();
    await this.locator.dblclick();
  }
}

export class Checkbox {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    readonly parentLocator: Locator,
    label?: string
  ) {
    this.locator = parentLocator.getByRole('checkbox', { name: label }).first();
  }

  async toggle() {
    await this.locator.click();
  }

  async expectValue(value: boolean) {
    if (value) {
      await expect(this.locator).toBeChecked();
    } else {
      await expect(this.locator).not.toBeChecked();
    }
  }
}

export class Combobox {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    parentLocator: Locator,
    label?: string
  ) {
    if (label) {
      this.locator = parentLocator.getByRole('combobox', { name: label }).first();
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(0);
    }
  }

  async fill(value: string) {
    await this.locator.fill(value);
    await this.locator.blur();
  }

  async choose(value: string) {
    await this.locator.fill(value);
    await this.page.getByRole('option', { name: value }).first().click();
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveValue(value);
  }
}
