import type { CaseMapModel, StageModel, StageProcessModel } from '@axonivy/case-map-editor-protocol';
import { describe, expect } from 'vitest';
import { formatProcessName, generateName, generateUniqueId } from './formatting';

describe('formatProcessName', () => {
  test('formats camelCase and PascalCase correctly', () => {
    expect(formatProcessName('CollectPersonalData')).toBe('Collect Personal Data');
    expect(formatProcessName('startProcess')).toBe('Start Process');
    expect(formatProcessName('generatePDF')).toBe('Generate PDF');
    expect(formatProcessName('exportXMLFile')).toBe('Export XML File');
  });

  test('formats snake_case and mixed case', () => {
    expect(formatProcessName('process_upload_file')).toBe('Process Upload File');
    expect(formatProcessName('processUpload_File')).toBe('Process Upload File');
  });

  test('handles empty string', () => {
    expect(formatProcessName('')).toBe('');
  });

  test('keeps acronyms intact', () => {
    expect(formatProcessName('convertToURL')).toBe('Convert To URL');
    expect(formatProcessName('parseJSONData')).toBe('Parse JSON Data');
  });
});

describe('generateName', () => {
  const processes = [
    { value: 'p1', name: 'CollectPersonalData', detail: '/collect' },
    { value: 'p2', name: 'startProcess', detail: '/start' },
    { value: 'p3', name: 'generatePDF', detail: '/pdf' }
  ];

  test('returns formatted name for a valid process', () => {
    expect(generateName('p1', processes)).toBe('Collect Personal Data');
    expect(generateName('p2', processes)).toBe('Start Process');
    expect(generateName('p3', processes)).toBe('Generate PDF');
  });

  test('returns default "Name" if process is not found', () => {
    expect(generateName('unknown', processes)).toBe('Name');
  });

  test('handles empty process array', () => {
    expect(generateName('p1', [])).toBe('Name');
  });
});

describe('generateUniqueId', () => {
  const mockCaseMap: Partial<CaseMapModel> = {
    stages: [{ id: 'stage1' }, { id: 'process1' }] as unknown as StageModel[]
  };

  test('generates lowercase ID without spaces', () => {
    expect(generateUniqueId('My New Stage', mockCaseMap as CaseMapModel)).toBe('mynewstage');
  });

  test('generates "newid" if name is empty', () => {
    expect(generateUniqueId('', mockCaseMap as CaseMapModel)).toBe('newid');
    expect(generateUniqueId('   ', mockCaseMap as CaseMapModel)).toBe('newid');
  });

  test('adds a number suffix if ID already exists', () => {
    const caseMapWithIds: Partial<CaseMapModel> = {
      stages: [
        { id: 'stage', processes: [], sidesteps: [] },
        { id: 'stage1', processes: [], sidesteps: [] }
      ] as unknown as StageModel[]
    };
    expect(generateUniqueId('Stage', caseMapWithIds as CaseMapModel)).toBe('stage2');
  });

  test('adds a number suffix if ID exists in processes', () => {
    const caseMapWithIds: Partial<CaseMapModel> = {
      stages: [
        {
          id: 's1',
          processes: [{ id: 'process' } as unknown as StageProcessModel],
          sidesteps: []
        }
      ] as unknown as StageModel[]
    };
    expect(generateUniqueId('Process', caseMapWithIds as CaseMapModel)).toBe('process2');
  });

  it('adds a number suffix if ID exists in sidesteps', () => {
    const caseMapWithIds: Partial<CaseMapModel> = {
      stages: [
        {
          id: 's1',
          processes: [],
          sidesteps: [{ id: 'sidestep' } as unknown as StageProcessModel]
        }
      ] as unknown as StageModel[]
    };
    expect(generateUniqueId('SideStep', caseMapWithIds as CaseMapModel)).toBe('sidestep2');
  });

  test('handles multiple collisions', () => {
    const caseMapWithIds: Partial<CaseMapModel> = {
      stages: [
        { id: 'stage', processes: [], sidesteps: [] },
        { id: 'stage1', processes: [], sidesteps: [] },
        { id: 'stage2', processes: [], sidesteps: [] }
      ] as unknown as StageModel[]
    };
    expect(generateUniqueId('Stage', caseMapWithIds as CaseMapModel)).toBe('stage3');
  });

  test('ignores whitespace and uppercase', () => {
    const caseMapWithNoStages: Partial<CaseMapModel> = { stages: [] };
    expect(generateUniqueId('  Stage  Name ', caseMapWithNoStages as CaseMapModel)).toBe('stagename');
    expect(generateUniqueId('Stage Name', caseMapWithNoStages as CaseMapModel)).toBe('stagename');
  });
});
