import { type CaseMap, type EditorProps } from '@axonivy/case-map-editor-protocol';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import './CaseMapEditor.css';
import { AppProvider, type SelectedElement } from './context/AppContext';
import { useGetCaseMapModel } from './data/case-map';
import { Detail } from './detail/Details';
import { CaseMapFlow } from './main/CaseMapFlow';
import { MainToolbar } from './main/MainToolbar';
import { useClient } from './protocol/ClientContextProvider';

function CaseMapEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);
  const [selectedElement, setSelectedElement] = useState<SelectedElement>();
  const { data, isPending, isError, error } = useGetCaseMapModel(props.context);
  const client = useClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updateData: CaseMap) => client.saveData({ pmv: props.context.pmv, caseMapUuid: props.context.uuid, model: updateData }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['model', props.context] })
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
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
        caseMap: data,
        setCaseMap: accept => {
          if (typeof accept === 'function') {
            mutation.mutate(accept(data));
          } else {
            mutation.mutate(accept);
          }
        },
        detail,
        setDetail,
        setSelectedElement,
        selectedElement
      }}
    >
      <link rel='stylesheet' href='/dev-workflow-ui/webjars/font-awesome/6.1.0/css/all.min.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/webjars/streamline-icons/StreamlineIcons.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/faces/javax.faces.resource/primeicons/primeicons.css?ln=primefaces' />
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='case-map-editor-main-panel'>
          <Flex direction='column' style={{ height: '100%' }}>
            <MainToolbar title={data.name} />

            <div
              className='case-map-editor-panel-content'
              onClick={() => {
                setDetail(!detail);
                setSelectedElement(undefined);
              }}
            >
              <CaseMapFlow />
            </div>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Detail />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default CaseMapEditor;
