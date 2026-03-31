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
  await flow.stageByNth(0).addProcess.click();
  const dialog = new AddProcessDialog(page);
  await dialog.process.expectOptionCount(9);
  await dialog.process.expectOptionName(0, 'AbortRequest- Lending/AbortRequest/start.ivp');
  await dialog.process.expectOptionName(6, 'ExternalSolvencyService- Lending/ExternalSolvencyService/start.ivp');
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
  const editor = await CaseMapEditor.openMock(page);
  await editor.flow.stageByNth(0).expectProcesses(1);
  await editor.flow.stageByNth(0).addProcess.click();
  const dialog = new AddProcessDialog(page);
  await dialog.process.choose('ExternalSolvencyService');
  await dialog.name.expectValue('External Solvency Service');
  await dialog.create.click();
  await editor.flow.stageByNth(0).expectProcesses(2);

  await editor.flow.stageByNth(0).processByNth(0).inscribe();
  await editor.inscription.expectHeader('externalsolvencyservice');
  const generalProcess = editor.inscription.collapsible('General');
  const id = generalProcess.input('Id');
  const name = generalProcess.input('Name');
  const process = generalProcess.combobox('Process');
  await id.expectValue('externalsolvencyservice');
  await name.expectValue('External Solvency Service');
  await process.expectValue('casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp');
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
  await expect(emptyMessage).toContainText('Add your first Stage to your Case Map.Add Stage');

  await main.getByRole('button', { name: 'Add Stage' }).click();
  const dialog = new AddStageDialog(page);
  await expect(dialog.locator).toBeVisible();
  await dialog.cancel.click();
  await expect(dialog.locator).toBeHidden();

  await page.keyboard.press('a');
  await expect(dialog.locator).toBeVisible();
});

test.describe('dnd', () => {
  test('move stage', async ({ page }) => {
    const { flow } = await CaseMapEditor.openMock(page);
    await flow.expectStageOrder(['Start Stage', 'Review Stage', 'Approval Stage']);
    await flow.stageByNth(0).dndTo(flow.stageByNth(2));
    await flow.expectStageOrder(['Review Stage', 'Approval Stage', 'Start Stage']);
  });

  test('move process', async ({ page }) => {
    const { flow } = await CaseMapEditor.openMock(page);
    await flow.stageByNth(0).expectProcessOrder(['Start Process']);
    await flow.stageByNth(2).expectProcessOrder(['Approval Process']);
    await flow.stageByNth(0).processByNth(0).dndTo(flow.stageByNth(2).processByNth(0));
    await flow.stageByNth(0).expectProcesses(0);
    await flow.stageByNth(2).expectProcessOrder(['Approval Process', 'Start Process']);
  });

  test('move process to stage', async ({ page }) => {
    const { flow } = await CaseMapEditor.openMock(page);
    await flow.stageByNth(0).expectProcessOrder(['Start Process']);
    await flow.expectStageOrder(['Start Stage', 'Review Stage', 'Approval Stage']);
    await flow.stageByNth(0).processByNth(0).dndTo(flow.stageByNth(2));
    await flow.stageByNth(0).expectProcesses(0);
    await flow.expectStageOrder(['Start Stage', 'Review Stage', 'process-1', 'Approval Stage']);
    await flow.stageByNth(2).expectProcessOrder(['Start Process']);
  });

  test('move process from palette into process', async ({ page }) => {
    const editor = await CaseMapEditor.openMock(page);
    await editor.flow.stageByNth(1).expectProcessOrder(['Review Process']);
    const palette = await editor.toolbar.openPalette('Processes');
    await palette.dndTo('ExternalSolvencyService', editor.flow.stageByNth(1).processByNth(0));
    await editor.flow.stageByNth(1).expectProcessOrder(['ExternalSolvencyService', 'Review Process']);
    await editor.flow.stageByNth(1).processByNth(0).inscribe();
    await editor.inscription.expectHeader('externalsolvencyservice');
    const generalProcess = editor.inscription.collapsible('General');
    const id = generalProcess.input('Id');
    const name = generalProcess.input('Name');
    const process = generalProcess.combobox('Process');
    await id.expectValue('externalsolvencyservice');
    await name.expectValue('ExternalSolvencyService');
    await process.expectValue('casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp');
  });

  test('move process from palette into stage', async ({ page }) => {
    const editor = await CaseMapEditor.openMock(page);
    await editor.flow.expectStageOrder(['Start Stage', 'Review Stage', 'Approval Stage']);
    const palette = await editor.toolbar.openPalette('Processes');
    await palette.dndTo('ExternalSolvencyService', editor.flow.stageByNth(1));
    await editor.flow.expectStageOrder(['Start Stage', 'ExternalSolvencyService', 'Review Stage', 'Approval Stage']);

    await editor.flow.stageByNth(1).processByNth(0).inscribe();
    await editor.inscription.expectHeader('externalsolvencyservice');
    const generalProcess = editor.inscription.collapsible('General');
    const id = generalProcess.input('Id');
    const name = generalProcess.input('Name');
    const process = generalProcess.combobox('Process');
    await id.expectValue('externalsolvencyservice2');
    await name.expectValue('ExternalSolvencyService');
    await process.expectValue('casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp');
  });

  test('move process from palette into empty', async ({ page }) => {
    const editor = await CaseMapEditor.openMock(page);
    await editor.flow.expectStages(3);
    await editor.flow.stageByNth(0).delete.click();
    await editor.flow.stageByNth(0).delete.click();
    await editor.flow.stageByNth(0).delete.click();
    await editor.flow.expectStages(0);
    const palette = await editor.toolbar.openPalette('Processes');
    const main = page.locator('#case-map-editor-main');
    const emptyMessage = main.locator('.ui-panel-message');
    await palette.dndTo('ExternalSolvencyService', emptyMessage);
    await editor.flow.expectStageOrder(['ExternalSolvencyService']);

    await editor.flow.stageByNth(0).processByNth(0).inscribe();
    await editor.inscription.expectHeader('externalsolvencyservice');
    const generalProcess = editor.inscription.collapsible('General');
    const id = generalProcess.input('Id');
    const name = generalProcess.input('Name');
    const process = generalProcess.combobox('Process');
    await id.expectValue('externalsolvencyservice2');
    await name.expectValue('ExternalSolvencyService');
    await process.expectValue('casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp');
  });

  test('filter palette', async ({ page }) => {
    const { toolbar } = await CaseMapEditor.openMock(page);
    const palette = await toolbar.openPalette('Processes');
    const solvency = palette.paletteItem('ExternalSolvencyService');
    const onboarding = palette.paletteItem('CustomerOnboardingProcess');
    await palette.expectSections(['Lending', 'Lending/Deep']);
    await expect(solvency).toBeVisible();
    await expect(onboarding).toBeVisible();

    await palette.filter('sol');
    await palette.expectSections(['Lending']);
    await expect(solvency).toBeVisible();
    await expect(onboarding).toBeHidden();
  });
});
