import { test } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

test.describe('CaseMapEditor', () => {
  let editor: CaseMapEditor;

  test.beforeEach(async ({ page }) => {
    editor = await CaseMapEditor.openMock(page);
  });

  test('screenshot', async () => {
    await editor.takeScreenshot('case-map-editor.png');
  });
});
