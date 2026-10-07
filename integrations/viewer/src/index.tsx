import {
  CaseMapViewer,
  CaseMapViewerClientJsonRpc,
  initQueryClient,
  ViewerClientContextProvider
} from '@axonivy/case-map-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { Flex, HotkeysProvider, ReadonlyProvider, Spinner, ThemeProvider, toast, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { appParam, fileParam, projectParam, themeParam, webSocketBaseParam } from './url-helper';

export async function start(): Promise<void> {
  const server = webSocketBaseParam();
  const project = projectParam();
  const file = fileParam();
  const app = appParam();
  const theme = themeParam();
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
        <Flex className='h-full' justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );
  const initialize = async (connection: Connection) => {
    const client = await CaseMapViewerClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ViewerClientContextProvider client={client}>
            <QueryClientProvider client={queryClient}>
              <ReadonlyProvider readonly={true}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <CaseMapViewer context={{ app, project, file }} />
                </HotkeysProvider>
              </ReadonlyProvider>
              <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
            </QueryClientProvider>
          </ViewerClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };
  const reconnect = async (connection: Connection, oldClient: CaseMapViewerClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<CaseMapViewerClientJsonRpc>(CaseMapViewerClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
