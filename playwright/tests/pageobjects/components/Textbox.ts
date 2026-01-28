import { expect, type Locator } from '@playwright/test';

export class Textbox {
  readonly parent: Locator;
  readonly locator: Locator;

  constructor(parent: Locator, options?: { name?: string; nth?: number }) {
    this.parent = parent;
    if (options?.name) {
      this.locator = parent.getByRole('textbox', { name: options.name, exact: true });
    } else {
      this.locator = parent.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }

  async expectToHaveNoPlaceholder() {
    await expect(this.locator).not.toHaveAttribute('placeholder');
  }

  async expectToHavePlaceholder(placeholder: string) {
    await expect(this.locator).toHaveAttribute('placeholder', placeholder);
  }
}
