import { expect, test } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

let editor: CaseMapEditor;

test.beforeEach(async ({ page }) => {
  editor = await CaseMapEditor.openMock(page);
});

test('open mock', async () => {
  await expect(editor.page.locator('.case-map-editor-content')).toHaveText('Mock Case Map');
});
