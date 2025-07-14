import { useGetCaseMapModel, type CaseMap, type EditorProps } from '@axonivy/case-map-editor-protocol';
import type { CaseMapModelRestServiceModel } from '@axonivy/case-map-editor-protocol/src/data/ivy-client';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { MainToolbar } from './main/MainToolbar';

function CaseMapEditor(props: EditorProps) {
  const [context, setContext] = useState(props.context);
  useEffect(() => {
    setContext(props.context);
  }, [props]);

  const [detail, setDetail] = useState(true);
  const [caseMapModel, setCaseMapModel] = useState<CaseMap>({} as CaseMap);
  const { data, isPending, isError, error } = useGetCaseMapModel(context.pmv, context.uuid);

  useEffect(() => {
    if (data) {
      const model = (data.data as CaseMapModelRestServiceModel).model;
      if (model !== undefined) {
        const caseMapModel = JSON.parse(model);
        setCaseMapModel(caseMapModel);
        console.log(caseMapModel);
      }
    }
  }, [data]);

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
    <AppProvider value={{ caseMap: caseMapModel, detail, setDetail }}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50}>
          <Flex direction='column'>
            <MainToolbar title={caseMapModel.name} />
            <div className='cms-editor-content'>{caseMapModel.name}</div>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Flex direction='column' className='cms-editor-detail-panel'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={caseMapModel.name} />
                <div>{caseMapModel.name}</div>
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default CaseMapEditor;
