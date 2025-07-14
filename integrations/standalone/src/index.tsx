import { CaseMapEditor, ClientContextProvider, initQueryClient, QueryProvider } from '@axonivy/case-map-editor';
import { Flex, HotkeysProvider, ReadonlyProvider, Spinner, ThemeProvider, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { readonlyParam, themeParam } from './url-helper';

export async function start(): Promise<void> {
  const theme = themeParam();
  const readonly = readonlyParam();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found.');
  }
  const root = ReactDOM.createRoot(rootElement);

  initTranslation();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const dummyClient = {} as const;
  const pmv = 'case-map-test-project';
  const caseMapUuid = '25099c02-721a-42ac-a3de-ff78e93a52b4';
  // Initialize the editor without websocket // Adjusted: assumes no connection param needed
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <ClientContextProvider client={dummyClient}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <HotkeysProvider initiallyActiveScopes={['global']}>
                <CaseMapEditor context={{ pmv, uuid: caseMapUuid }} />
              </HotkeysProvider>
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
