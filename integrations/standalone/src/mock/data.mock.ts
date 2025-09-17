import type { CaseMapModel } from '@axonivy/case-map-editor-protocol';

export const data: CaseMapModel = {
  uuid: 'mock-uuid',
  id: { id: 'mock-id' },
  name: 'Mock Case Map',
  description: 'A mock case map for testing purposes',
  stages: [
    {
      id: { id: 'stage-1' },
      name: 'Start Stage',
      icon: 'start-icon',
      isTerminating: false,
      description: 'This is the starting stage.',
      processes: [
        {
          id: { id: 'process-1' },
          name: 'Start Process',
          description: 'This process starts the case.',
          preCondition: {
            script: { script: 'return true;' },
            label: 'Always start'
          },
          processToExecute: { value: 'my.start.Process' }
        }
      ],
      sideSteps: []
    },
    {
      id: { id: 'stage-2' },
      name: 'Review Stage',
      icon: 'review-icon',
      isTerminating: false,
      description: 'Stage for reviewing the case details.',
      processes: [
        {
          id: { id: 'process-2' },
          name: 'Review Process',
          description: 'Handles case review logic.',
          preCondition: {
            script: { script: 'return true;' },
            label: 'Proceed to review'
          },
          processToExecute: { value: 'my.review.Process' }
        }
      ],
      sideSteps: [
        {
          id: { id: 'sidestep-2' },
          name: 'Request Changes',
          description: 'Optional sidestep for requesting changes.',
          preCondition: {
            script: { script: 'return true;' },
            label: 'If changes are needed'
          },
          processToExecute: { value: 'my.requestChanges.Process' }
        }
      ]
    },
    {
      id: { id: 'stage-3' },
      name: 'Approval Stage',
      icon: 'approval-icon',
      isTerminating: true,
      description: 'Final stage for approving the case.',
      processes: [
        {
          id: { id: 'process-3' },
          name: 'Approval Process',
          description: 'Executes final approval steps.',
          preCondition: {
            script: { script: 'return true;' },
            label: 'Ready for approval'
          },
          processToExecute: { value: 'my.approval.Process' }
        }
      ],
      sideSteps: [
        {
          id: { id: 'sidestep-3' },
          name: 'Reject Case',
          description: 'Optional sidestep to reject the case.',
          preCondition: {
            script: { script: 'return true;' },
            label: 'Reject if criteria not met'
          },
          processToExecute: { value: 'my.reject.Process' }
        }
      ]
    }
  ]
};
