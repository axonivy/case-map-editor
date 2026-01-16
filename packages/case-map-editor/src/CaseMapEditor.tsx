import { type CaseMapContext, type CaseMapEditorData, type CaseMapModel, type EditorProps } from '@axonivy/case-map-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  type Unary,
  useDefaultLayout
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import './CaseMapEditor.css';
import { AppProvider, type SelectedElement } from './context/AppContext';
import { DndContext } from './context/DndContext';
import { Detail } from './detail/Details';
import { CaseMapFlow } from './main/CaseMapFlow';
import { MainToolbar } from './main/MainToolbar';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';

function CaseMapEditor(props: EditorProps) {
  const [detail, setDetail] = useState(false);
  const context = props.context;
  const [selectedElement, setSelectedElement] = useState<SelectedElement>();

  const client = useClient();

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'case-map-resize', storage: localStorage });
  /**
   * TODO: Implement animation handling
   * useEffect(() => {
   *   const animateDispose = client.onAnimate(data => animate(data));
   *   return () => {
   *     animateDispose.dispose();
   *   };
   * }, [client]);
   */

  const queryClient = useQueryClient();
  const queryKeys = useMemo(() => {
    return {
      data: (context: CaseMapContext) => genQueryKey('data', context),
      saveData: (context: CaseMapContext) => genQueryKey('saveData', context)
    };
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => {
      return await client.data(context);
    },
    structuralSharing: false
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (updateData: Unary<CaseMapModel>) => {
      const saveData = queryClient.setQueryData<CaseMapEditorData>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave: props.directSave });
      }
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries()
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
        caseMap: data.data,
        setCaseMap: mutation.mutate,
        detail,
        setDetail,
        setSelectedElement,
        selectedElement,
        context
      }}
    >
      {/* <link rel='stylesheet' href='/dev-workflow-ui/webjars/font-awesome/6.1.0/css/all.min.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/webjars/streamline-icons/StreamlineIcons.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/faces/javax.faces.resource/primeicons/primeicons.css?ln=primefaces' /> */}
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <DndContext>
          <ResizablePanel defaultSize='75%' minSize='50%' className='case-map-editor-main-panel'>
            <Flex direction='column' style={{ height: '100%' }}>
              <MainToolbar title={data ? data.data.name : ''} />

              <div
                className='case-map-editor-panel-content'
                onClick={() => {
                  setSelectedElement(undefined);
                  setDetail(false);
                }}
              >
                <CaseMapFlow />
              </div>
            </Flex>
          </ResizablePanel>
        </DndContext>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize='25%' minSize='10%'>
              <Detail />
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
}

export default CaseMapEditor;
