import { type EditorProps } from '@axonivy/case-map-editor-protocol';
import { Flex, PanelMessage, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AppProvider, type SelectedElement } from './context/AppContext';
import { useCaseMapQueryKeys } from './hooks/useCaseMapQueryKeys';
import { CaseMapFlow } from './main/CaseMapFlow';
import { useViewerClient } from './protocol/ClientContextProvider';

function CaseMapViewer(props: EditorProps) {
  const context = props.context;
  const [selectedElement, setSelectedElement] = useState<SelectedElement>();
  const client = useViewerClient();
  const queryKeys = useCaseMapQueryKeys();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => {
      return await client.data(context);
    },
    structuralSharing: false
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' className='size-full'>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }

  return (
    <AppProvider
      value={{
        caseMap: data.data,
        setCaseMap: () => {},
        detail: false,
        setDetail: () => {},
        history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
        setSelectedElement,
        selectedElement,
        context,
        helpUrl: data.helpUrl
      }}
    >
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/webjars/font-awesome/6.1.0/css/all.min.css`} />
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/webjars/font-awesome/6.1.0/css/v4-shims.min.css`} />
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/webjars/streamline-icons/StreamlineIcons.css`} />
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/faces/javax.faces.resource/primeicons/primeicons.css?ln=primefaces`} />
      <div className='h-full overflow-x-auto bg-n100'>
        <CaseMapFlow />
      </div>
    </AppProvider>
  );
}

export default CaseMapViewer;
