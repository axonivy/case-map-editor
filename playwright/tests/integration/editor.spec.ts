import { expect, test } from '@playwright/test';
import { AddProcessDialog } from '../pageobjects/AddProcessDialog';
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
  await dialog.name.locator.fill(`Cool Stage`);
  await dialog.icon.fill(`ti ti-user`);
  await dialog.create.click();
  await editor.flow.expectStages(4);

  await editor.flow.stageByNth(3).inscribe();
  await editor.inscription.expectHeader('coolstage');
  const general = editor.inscription.collapsible('General');
  const id = general.input('Id');
  const name = general.input('Name');
  const icon = general.combobox('Icon');
  await id.expectValue('coolstage');
  await name.expectValue('Cool Stage');
  await icon.expectValue('ti ti-user');

  await page.reload();
  await editor.flow.expectStages(4);

  await editor.flow.stageByNth(3).delete.click();
  await editor.flow.expectStages(3);
});

test('add process', async ({ page }) => {
  const editor = await CaseMapEditor.openCaseMap(page);
  await editor.flow.stageByNth(0).expectProcesses(2);
  await editor.flow.stageByNth(0).addProcess.click();
  const dialog = new AddProcessDialog(page);
  await dialog.process.choose('ExternalSolvencyService');
  await dialog.name.expectValue('External Solvency Service');
  await dialog.create.click();
  await editor.flow.stageByNth(0).expectProcesses(3);

  await editor.flow.stageByNth(0).processByNth(0).inscribe();
  await editor.inscription.expectHeader('externalsolvencyservice');
  const generalProcess = editor.inscription.collapsible('General');
  const id = generalProcess.input('Id');
  const name = generalProcess.input('Name');
  const process = generalProcess.combobox('Process');
  await id.expectValue('externalsolvencyservice');
  await name.expectValue('External Solvency Service');
  await process.expectValue('casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp');

  await page.reload();
  await editor.flow.stageByNth(0).expectProcesses(3);

  await expect(editor.flow.stageByNth(0).deleteProcess).toBeHidden();
  await editor.flow.stageByNth(0).processByNth(0).process.click();
  await expect(editor.flow.stageByNth(0).deleteProcess).toBeVisible();
  await editor.flow.stageByNth(0).deleteProcess.click();
  await editor.flow.stageByNth(0).expectProcesses(2);
});

test('empty', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  await editor.flow.expectStages(3);
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.stageByNth(0).delete.click();
  await editor.flow.expectStages(0);

  const main = page.locator('#case-map-editor-main');
  const emptyMessage = main.locator('.ui-panel-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toContainText('There are no stages in this case map. Add the first stage to start building the case map.');

  await main.getByRole('button', { name: 'Add Stage' }).click();
  const dialog = new AddStageDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});
