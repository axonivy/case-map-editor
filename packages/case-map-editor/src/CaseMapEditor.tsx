import { type EditorProps } from '@axonivy/case-map-editor-protocol';

import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useGetCaseMapModel } from './data/case-map';
import type { CaseMapModelRestServiceModel } from './data/ivy-client';
import { MainToolbar } from './main/MainToolbar';

function CaseMapEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);
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

  const caseMapModel = JSON.parse((data.data as CaseMapModelRestServiceModel).model ?? '{}');

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
