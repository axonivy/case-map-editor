import type { CaseMapModel, ProcessStart } from '@axonivy/case-map-editor-protocol';

export const data: CaseMapModel = {
  $schema: 'https://case-map-editor.axonivy.com/schema/case-map-model.json',
  uuid: 'mock-uuid',
  id: 'mock-id',
  name: 'Mock Case Map',
  description: 'A mock case map for testing purposes',
  stages: [
    {
      id: 'stage-1',
      name: 'Start Stage',
      icon: 'ti ti-player-play',
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
      sidesteps: []
    },
    {
      id: 'stage-2',
      name: 'Review Stage',
      icon: 'ti ti-eye',
      isTerminating: false,
      description: 'Stage for reviewing the case details.',
      processes: [
        {
          id: 'process-2',
          name: 'Review Process',
          description: 'Handles case review logic.',
          preCondition: {
            script: 'return true;',
            label: 'Proceed to review'
          },
          processToExecute: 'my.review.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-2',
          name: 'Request Changes',
          description: 'Optional sidestep for requesting changes.',
          preCondition: {
            script: 'return true;',
            label: 'If changes are needed'
          },
          processToExecute: 'my.requestChanges.Process'
        }
      ]
    },
    {
      id: 'stage-3',
      name: 'Approval Stage',
      icon: 'ti ti-check',
      isTerminating: true,
      description: 'Final stage for approving the case.',
      processes: [
        {
          id: 'process-3',
          name: 'Approval Process',
          description: 'Executes final approval steps.',
          preCondition: {
            script: 'return true;',
            label: 'Ready for approval'
          },
          processToExecute: 'my.approval.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-3',
          name: 'Reject Case',
          description: 'Optional sidestep to reject the case.',
          preCondition: {
            script: 'return true;',
            label: 'Reject if criteria not met'
          },
          processToExecute: 'my.reject.Process'
        }
      ]
    }
  ]
};

export const PROCESSES: Array<ProcessStart> = [
  {
    description: '',
    name: 'start.ivp',
    processName: 'ExternalSolvencyService',
    processReference: 'casemap.test.project:casemap-test-project:15A8995AA29B442B/start.ivp',
    projectName: 'casemap-test-project',
    signature: 'start()',
    startDescription: '',
    startName: '',
    userFriendlyRequestPath: 'Lending/ExternalSolvencyService/start.ivp'
  },
  {
    description: '',
    name: 'start.ivp',
    processName: 'CustomerOnboardingProcess',
    processReference: 'casemap.test.project:casemap-test-project:9B2211AA11CC4422/start.ivp',
    projectName: 'casemap-test-project',
    signature: 'start()',
    startDescription: '',
    startName: '',
    userFriendlyRequestPath: 'Lending/CustomerOnboardingProcess/start.ivp'
  },
  {
    description: '',
    name: 'start.ivp',
    processName: 'FraudDetectionProcess',
    processReference: 'casemap.test.project:casemap-test-project:7F3311DD55EE8899/start.ivp',
    projectName: 'casemap-test-project',
    signature: 'start()',
    startDescription: '',
    startName: '',
    userFriendlyRequestPath: 'Lending/FraudDetectionProcess/start.ivp'
  }
];
