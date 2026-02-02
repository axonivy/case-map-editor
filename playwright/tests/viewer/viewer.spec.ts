import { expect, test } from '@playwright/test';
import { AddStageDialog } from '../pageobjects/AddStageDialog';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

test('correct viewer mode', async ({ page }) => {
  const { toolbar, inscription, flow } = await CaseMapEditor.openCaseMapViewer(page);
  await expect(toolbar.locator).toBeHidden();

  await flow.stageByNth(0).expectProcesses(2);
  await flow.stageByNth(0).expectSidesteps(0);
  await flow.stageByNth(1).expectProcesses(1);
  await flow.stageByNth(2).expectProcesses(3);
  await flow.stageByNth(2).expectSidesteps(0);
  await expect(flow.stageByNth(0).stage.locator('.no-processes-message')).toHaveCount(1);

  // eslint-disable-next-line playwright/no-force-option
  await flow.stageByNth(0).stage.dblclick({ force: true });
  await flow.stageByNth(0).expectSelected();
  await expect(inscription.view).toBeHidden();
  await flow.expectStages(3);
  await page.keyboard.press('Delete');
  await flow.expectStages(3);
  // eslint-disable-next-line playwright/no-force-option
  await flow.stageByNth(1).processByNth(0).process.dblclick({ force: true });
  await flow.stageByNth(1).processByNth(0).expectSelected();
  await expect(inscription.view).toBeHidden();
  await flow.stageByNth(1).expectSidesteps(1);
  await page.keyboard.press('Delete');
  await flow.stageByNth(1).expectProcesses(1);

  await expect(flow.stageByNth(0).delete).toBeHidden();

  await page.keyboard.press('a');
  const dialog = new AddStageDialog(page);
  await expect(dialog.locator).toBeHidden();
});
