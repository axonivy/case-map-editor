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
      sidesteps: []
    },
    {
      id: 'stage-2',
      name: 'Review Stage',
      icon: 'review-icon',
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
      icon: 'approval-icon',
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
