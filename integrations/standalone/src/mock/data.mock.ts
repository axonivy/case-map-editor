import type { CaseMapModel } from '@axonivy/case-map-editor-protocol';

export const data: CaseMapModel = {
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
          preCondition: { script: 'return true;', label: 'Always start' },
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
          preCondition: { script: 'return true;', label: 'Proceed to review' },
          processToExecute: 'my.review.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-2',
          name: 'Request Changes',
          description: 'Optional sidestep for requesting changes.',
          preCondition: { script: 'return true;', label: 'If changes are needed' },
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
          preCondition: { script: 'return true;', label: 'Ready for approval' },
          processToExecute: 'my.approval.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-3',
          name: 'Reject Case',
          description: 'Optional sidestep to reject the case.',
          preCondition: { script: 'return true;', label: 'Reject if criteria not met' },
          processToExecute: 'my.reject.Process'
        }
      ]
    },

    // -------- Added stages --------

    {
      id: 'stage-4',
      name: 'Data Collection',
      icon: 'data-icon',
      isTerminating: false,
      description: 'Collect required data and documents.',
      processes: [
        {
          id: 'process-4-1',
          name: 'Collect Data',
          description: 'Collects user data.',
          preCondition: { script: 'return true;', label: 'Data needed' },
          processToExecute: 'my.collectData.Process'
        },
        {
          id: 'process-4-2',
          name: 'Validate Data',
          description: 'Validates collected data.',
          preCondition: { script: 'return true;', label: 'Data collected' },
          processToExecute: 'my.validateData.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-4-1',
          name: 'Request Missing Data',
          description: 'Ask for missing inputs.',
          preCondition: { script: 'return true;', label: 'Missing data' },
          processToExecute: 'my.requestData.Process'
        }
      ]
    },
    {
      id: 'stage-5',
      name: 'Risk Assessment',
      icon: 'risk-icon',
      isTerminating: false,
      description: 'Assess risk level.',
      processes: [
        {
          id: 'process-5-1',
          name: 'Calculate Risk',
          description: 'Calculates risk score.',
          preCondition: { script: 'return true;', label: 'Data valid' },
          processToExecute: 'my.calculateRisk.Process'
        },
        {
          id: 'process-5-2',
          name: 'Classify Risk',
          description: 'Assigns risk category.',
          preCondition: { script: 'return true;', label: 'Score ready' },
          processToExecute: 'my.classifyRisk.Process'
        },
        {
          id: 'process-5-3',
          name: 'Store Risk',
          description: 'Persists risk data.',
          preCondition: { script: 'return true;', label: 'Risk classified' },
          processToExecute: 'my.storeRisk.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-5-1',
          name: 'Manual Review',
          description: 'Manual risk evaluation.',
          preCondition: { script: 'return true;', label: 'High risk' },
          processToExecute: 'my.manualRiskReview.Process'
        }
      ]
    },
    {
      id: 'stage-6',
      name: 'Compliance Check',
      icon: 'compliance-icon',
      isTerminating: false,
      description: 'Ensure compliance with policies.',
      processes: [
        {
          id: 'process-6-1',
          name: 'Policy Check',
          description: 'Checks internal policies.',
          preCondition: { script: 'return true;', label: 'Always' },
          processToExecute: 'my.policyCheck.Process'
        },
        {
          id: 'process-6-2',
          name: 'Legal Check',
          description: 'Checks legal constraints.',
          preCondition: { script: 'return true;', label: 'Always' },
          processToExecute: 'my.legalCheck.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-6-1',
          name: 'Escalate to Legal',
          description: 'Escalation path.',
          preCondition: { script: 'return true;', label: 'Legal issues' },
          processToExecute: 'my.escalateLegal.Process'
        }
      ]
    },
    {
      id: 'stage-7',
      name: 'Cost Estimation',
      icon: 'cost-icon',
      isTerminating: false,
      description: 'Estimate costs.',
      processes: [
        {
          id: 'process-7-1',
          name: 'Estimate Cost',
          description: 'Initial estimate.',
          preCondition: { script: 'return true;', label: 'Proceed' },
          processToExecute: 'my.estimateCost.Process'
        },
        {
          id: 'process-7-2',
          name: 'Adjust Cost',
          description: 'Adjustments if needed.',
          preCondition: { script: 'return true;', label: 'Adjust' },
          processToExecute: 'my.adjustCost.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-7-1',
          name: 'Request Budget Approval',
          description: 'Extra approval.',
          preCondition: { script: 'return true;', label: 'Over budget' },
          processToExecute: 'my.budgetApproval.Process'
        }
      ]
    },
    {
      id: 'stage-8',
      name: 'Resource Allocation',
      icon: 'resource-icon',
      isTerminating: false,
      description: 'Assign resources.',
      processes: [
        {
          id: 'process-8-1',
          name: 'Allocate Resources',
          description: 'Assign staff/resources.',
          preCondition: { script: 'return true;', label: 'Ready' },
          processToExecute: 'my.allocateResources.Process'
        },
        {
          id: 'process-8-2',
          name: 'Confirm Allocation',
          description: 'Confirm assignments.',
          preCondition: { script: 'return true;', label: 'Allocated' },
          processToExecute: 'my.confirmAllocation.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-8-1',
          name: 'Reassign Resources',
          description: 'Change allocation.',
          preCondition: { script: 'return true;', label: 'Conflict' },
          processToExecute: 'my.reassignResources.Process'
        }
      ]
    },
    {
      id: 'stage-9',
      name: 'Execution',
      icon: 'execute-icon',
      isTerminating: false,
      description: 'Execute planned work.',
      processes: [
        {
          id: 'process-9-1',
          name: 'Execute Task A',
          description: 'Primary execution.',
          preCondition: { script: 'return true;', label: 'Start' },
          processToExecute: 'my.executeA.Process'
        },
        {
          id: 'process-9-2',
          name: 'Execute Task B',
          description: 'Secondary execution.',
          preCondition: { script: 'return true;', label: 'Continue' },
          processToExecute: 'my.executeB.Process'
        },
        {
          id: 'process-9-3',
          name: 'Monitor Progress',
          description: 'Track progress.',
          preCondition: { script: 'return true;', label: 'Running' },
          processToExecute: 'my.monitor.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-9-1',
          name: 'Pause Execution',
          description: 'Temporary halt.',
          preCondition: { script: 'return true;', label: 'Issue detected' },
          processToExecute: 'my.pauseExecution.Process'
        }
      ]
    },
    {
      id: 'stage-10',
      name: 'Quality Assurance',
      icon: 'qa-icon',
      isTerminating: false,
      description: 'Verify quality.',
      processes: [
        {
          id: 'process-10-1',
          name: 'QA Check',
          description: 'Run QA tests.',
          preCondition: { script: 'return true;', label: 'Done' },
          processToExecute: 'my.qaCheck.Process'
        },
        {
          id: 'process-10-2',
          name: 'QA Approval',
          description: 'Approve QA.',
          preCondition: { script: 'return true;', label: 'Passed' },
          processToExecute: 'my.qaApproval.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-10-1',
          name: 'Fix Issues',
          description: 'Address defects.',
          preCondition: { script: 'return true;', label: 'Failed' },
          processToExecute: 'my.fixIssues.Process'
        }
      ]
    },
    {
      id: 'stage-11',
      name: 'Customer Notification',
      icon: 'notify-icon',
      isTerminating: false,
      description: 'Notify customer.',
      processes: [
        {
          id: 'process-11-1',
          name: 'Prepare Notification',
          description: 'Compose message.',
          preCondition: { script: 'return true;', label: 'Ready' },
          processToExecute: 'my.prepareNotification.Process'
        },
        {
          id: 'process-11-2',
          name: 'Send Notification',
          description: 'Send message.',
          preCondition: { script: 'return true;', label: 'Prepared' },
          processToExecute: 'my.sendNotification.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-11-1',
          name: 'Delay Notification',
          description: 'Delay sending.',
          preCondition: { script: 'return true;', label: 'Delay requested' },
          processToExecute: 'my.delayNotification.Process'
        }
      ]
    },
    {
      id: 'stage-12',
      name: 'Closure',
      icon: 'close-icon',
      isTerminating: true,
      description: 'Close the case.',
      processes: [
        {
          id: 'process-12-1',
          name: 'Archive Case',
          description: 'Archive data.',
          preCondition: { script: 'return true;', label: 'Complete' },
          processToExecute: 'my.archive.Process'
        },
        {
          id: 'process-12-2',
          name: 'Close Case',
          description: 'Final closure.',
          preCondition: { script: 'return true;', label: 'Archived' },
          processToExecute: 'my.closeCase.Process'
        }
      ],
      sidesteps: [
        {
          id: 'sidestep-12-1',
          name: 'Reopen Case',
          description: 'Reopen if needed.',
          preCondition: { script: 'return true;', label: 'Reopen requested' },
          processToExecute: 'my.reopenCase.Process'
        }
      ]
    }
  ]
};
