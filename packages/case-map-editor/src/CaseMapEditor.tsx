import { type EditorProps } from '@axonivy/case-map-editor-protocol';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import './CaseMapEditor.css';
import { AppProvider } from './context/AppContext';
import { useGetCaseMapModel } from './data/case-map';
import { Sidebar } from './detail/Sidebar';
import { CaseMapFlow } from './main/CaseMapFlow';
import { MainToolbar } from './main/MainToolbar';

function CaseMapEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string>();
  const { data, isPending, isError, error } = useGetCaseMapModel(props.context.pmv, props.context.uuid);

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
    <AppProvider value={{ caseMap: data.caseMapModel, detail, setDetail, selectedElement, setSelectedElement }}>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='case-map-editor-main-panel'>
          <Flex direction='column' style={{ height: '100%' }}>
            <MainToolbar title={data.caseMapModel.name} />
            <div className='case-map-editor-panel-content' onClick={() => setDetail(false)}>
              <CaseMapFlow />
            </div>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Sidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default CaseMapEditor;
