import { expect, test } from '@playwright/test';
import { AddStageDialog } from '../pageobjects/AddStageDialog';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

test('data', async ({ page }) => {
  const { flow } = await CaseMapEditor.openCaseMap(page);
  await flow.expectStages(3);
  await flow.stageByNth(0).expectProcesses(2);
  await flow.stageByNth(0).expectSidesteps(0);
  await flow.stageByNth(1).expectProcesses(1);
  await flow.stageByNth(1).expectSidesteps(1);
  await flow.stageByNth(2).expectProcesses(3);
  await flow.stageByNth(2).expectSidesteps(0);
});

test('save data', async ({ page }) => {
  const editor = await CaseMapEditor.openCaseMap(page);
  await editor.flow.expectStages(3);
  const dialog = await editor.flow.openAddStageDialog();
  const newStageId = `coolStage`;
  const newStageName = `Cool Stage`;
  const newStageIcon = `si si-single-neutral-actions`;
  await dialog.name.locator.fill(newStageName);
  await dialog.icon.locator.fill(newStageIcon);
  await dialog.id.locator.fill(newStageId);
  await dialog.create.click();
  await editor.flow.expectStages(4);

  await editor.flow.stageByNth(3).inscribe();
  await editor.inscription.expectHeader('coolStage');
  const general = editor.inscription.collapsible('General');
  const id = general.input('Id');
  const name = general.input('Name');
  const icon = general.combobox('Icon');
  await id.expectValue('coolStage');
  await name.expectValue('Cool Stage');
  await icon.expectValue('si si-single-neutral-actions');

  await page.reload();
  await editor.flow.expectStages(4);

  await editor.flow.stageByNth(3).delete.click();
  await editor.flow.expectStages(3);
});

test('empty', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  await editor.flow.expectStages(3);
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.expectStages(0);

  const mainPanel = page.locator('.case-map-editor-main-panel');
  const emptyMessage = mainPanel.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();

  await mainPanel.locator('button', { hasText: 'Add Stage' }).click();
  const dialog = new AddStageDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
