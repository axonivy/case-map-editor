import { expect, test } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

let editor: CaseMapEditor;

test.beforeEach(async ({ page }) => {
  editor = await CaseMapEditor.openCaseMap(page);
});

test('load data', async () => {
  await expect(editor.page.locator('.case-map-editor-content')).toHaveText('Lending (Case Map)');
});
