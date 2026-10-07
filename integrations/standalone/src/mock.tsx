import { CaseMapEditor, ClientContextProvider, initQueryClient } from '@axonivy/case-map-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { CaseMapClientMock } from './mock/case-map-client-mock';
import { readonlyParam } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found.');
}
const root = ReactDOM.createRoot(rootElement);

const client = new CaseMapClientMock();
const queryClient = initQueryClient();

const readonly = readonlyParam();

initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <CaseMapEditor context={{ app: '', file: '', project: '' }} />
            </HotkeysProvider>
          </ReadonlyProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
        </QueryClientProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
