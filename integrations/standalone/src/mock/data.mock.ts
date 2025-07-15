import type { CaseMap } from '@axonivy/case-map-editor-protocol';

export const data: CaseMap = {
  uuid: 'mock-uuid',
  id: 'mock-id',
  name: 'Mock Case Map',
  description: 'A mock case map for testing purposes',
  stages: [
    {
      id: 'stage-1',
      name: 'Start Stage',
      icon: 'start-icon',
      isTerminating: false,
      description: 'This is the starting stage.',
      processes: [
        {
          id: 'process-1',
          name: 'Start Process',
          description: 'This process starts the case.',
          preCondition: {
            script: 'return true;',
            label: 'Always start'
          },
          processToExecute: 'my.start.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-1',
          name: 'Alternative Path',
          description: 'This sidestep is optional.',
          preCondition: {
            script: 'return false;',
            label: 'Never'
          },
          processToExecute: 'my.alt.Process'
        }
      ]
    }
  ]
};
