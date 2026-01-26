import type { CaseMapActionArgs } from '@axonivy/case-map-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../protocol/ClientContextProvider';

export function useAction(actionId: CaseMapActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: CaseMapActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
