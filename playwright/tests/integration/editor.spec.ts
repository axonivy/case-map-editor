import { test } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';

test('open mock', async ({ page }) => {
  const { flow } = await CaseMapEditor.openMock(page);
  await flow.expectStages(3);
  await flow.stageByNth(0).expectProcesses(1);
  await flow.stageByNth(0).expectSidesteps(0);
  await flow.stageByNth(1).expectProcesses(1);
  await flow.stageByNth(1).expectSidesteps(1);
});
