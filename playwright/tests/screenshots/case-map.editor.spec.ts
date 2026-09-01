import { test } from '@playwright/test';
import { CaseMapEditor } from '../pageobjects/CaseMapEditor';
import { screenshot, screenshotElement } from './screenshot-utils';

test('editor', async ({ page }) => {
  await CaseMapEditor.openMock(page);
  await screenshot(page, 'case-map-editor');
});

test('stage', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  const stage = editor.flow.stageByNth(0);
  await screenshotElement(stage.stage, 'case-map-stage');
});

test('process', async ({ page }) => {
  const editor = await CaseMapEditor.openMock(page);
  const stage = editor.flow.stageByNth(0);
  const process = stage.processByNth(0);
  await screenshotElement(process.process, 'case-map-process');
});
