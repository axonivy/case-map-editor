import test, { expect } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

test('case map', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  await editor.toolbar.detailToggle.click();
  await editor.inscription.expectHeader('Mock Case Map');
  const general = editor.inscription.collapsible('General');
  const id = general.input('Id');
  const name = general.input('Name');
  const description = general.input('Description');
  await id.expectValue('mock-id');
  await name.expectValue('Mock Case Map');
  await description.expectValue('A mock case map for testing purposes');

  await name.fill('New Case Map Name');
  await description.fill('New Description');

  await name.expectValue('New Case Map Name');
  await description.expectValue('New Description');
  await expect(editor.toolbar.locator).toHaveText('New Case Map Name');
});

test('stage', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  await editor.flow.stageByNth(0).inscribe();
  await editor.inscription.expectHeader('stage-1');
  const general = editor.inscription.collapsible('General');
  const id = general.input('Id');
  const name = general.input('Name');
  const description = general.input('Description');
  const icon = general.combobox('Icon');
  const isTerminating = general.checkbox('Is Terminating');
  await id.expectValue('stage-1');
  await name.expectValue('Start Stage');
  await description.expectValue('This is the starting stage.');
  await icon.expectValue('ti ti-player-play');
  await isTerminating.expectValue(false);

  await name.fill('New Stage Name');
  await description.fill('New Description');
  await icon.fill('new-icon');
  await isTerminating.toggle();

  await description.expectValue('New Description');
  await icon.expectValue('new-icon');
  await isTerminating.expectValue(true);
});

test('process', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  await editor.flow.stageByNth(0).processByNth(0).inscribe();
  await editor.inscription.expectHeader('process-1');
  const general = editor.inscription.collapsible('General');
  const id = general.input('Id');
  const name = general.input('Name');
  const description = general.input('Description');
  const process = general.combobox('Process');
  const precondition = editor.inscription.collapsible('Precondition');
  const label = precondition.input('Label');
  const condition = precondition.input('Condition');

  await id.expectValue('process-1');
  await name.expectValue('Start Process');
  await description.expectValue('This process starts the case.');
  await process.expectValue('my.start.Process');
  await label.expectValue('Always start');
  await condition.expectValue('return true;');

  await name.fill('New Stage Name');
  await description.fill('New Description');
  await process.fill('new-process');
  await label.fill('New Label');
  await condition.fill('New Condition');

  await description.expectValue('New Description');
  await process.expectValue('new-process');
  await label.expectValue('New Label');
  await condition.expectValue('New Condition');
});
