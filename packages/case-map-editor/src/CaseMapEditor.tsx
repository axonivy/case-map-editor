import { type CaseMapEditorData, type CaseMapModel, type EditorProps } from '@axonivy/case-map-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  type Unary,
  useDefaultLayout,
  useHistoryData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AppProvider, type SelectedElement } from './context/AppContext';
import { DndContext } from './context/DndContext';
import { Detail } from './detail/Details';
import { useCaseMapQueryKeys } from './hooks/useCaseMapQueryKeys';
import { CaseMapFlow } from './main/CaseMapFlow';
import { MainToolbar } from './main/MainToolbar';
import { useClient } from './protocol/ClientContextProvider';

function CaseMapEditor(props: EditorProps) {
  const [detail, setDetail] = useState(false);
  const context = props.context;
  const [selectedElement, setSelectedElement] = useState<SelectedElement>();
  const client = useClient();
  const [initialData, setInitialData] = useState<CaseMapModel | undefined>(undefined);
  const history = useHistoryData<CaseMapModel>();
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'case-map-resize', storage: localStorage });
  const queryKeys = useCaseMapQueryKeys();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => {
      return await client.data(context);
    },
    structuralSharing: false
  });

  if (data?.data !== undefined && initialData === undefined) {
    setInitialData(data.data);
    history.push(data.data);
  }

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
        setCaseMap: mutation.mutate,
        detail,
        setDetail,
        history,
        setSelectedElement,
        selectedElement,
        context,
        helpUrl: data.helpUrl
      }}
    >
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/webjars/font-awesome/6.1.0/css/all.min.css`} crossOrigin='anonymous' />
      <link
        rel='stylesheet'
        href={`${data.baseUrl}/dev-workflow-ui/webjars/font-awesome/6.1.0/css/v4-shims.min.css`}
        crossOrigin='anonymous'
      />
      <link
        rel='stylesheet'
        href={`${data.baseUrl}/dev-workflow-ui/webjars/streamline-icons/StreamlineIcons.css`}
        crossOrigin='anonymous'
      />
      <link
        rel='stylesheet'
        href={`${data.baseUrl}/dev-workflow-ui/faces/javax.faces.resource/primeicons/primeicons.css?ln=primefaces`}
        crossOrigin='anonymous'
      />
      <link rel='stylesheet' href={`${data.baseUrl}/dev-workflow-ui/webjars/tabler-icons/tabler-icons.min.css`} crossOrigin='anonymous' />
      <link
        rel='stylesheet'
        href={`${data.baseUrl}/dev-workflow-ui/webjars/tabler-icons/tabler-icons-filled.min.css`}
        crossOrigin='anonymous'
      />
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <DndContext>
          <ResizablePanel id='case-map-editor-main' defaultSize='75%' minSize='50%' className='h-full bg-n100'>
            <Flex direction='column' className='h-full'>
              <MainToolbar title={data ? data.data.name : ''} />

              <div
                className='h-full overflow-x-auto'
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
            <ResizablePanel id='case-map-editor-detail' defaultSize='25%' minSize='10%' className='h-full'>
              <Flex direction='column' className='h-full'>
                <Detail />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
}

export default CaseMapEditor;
