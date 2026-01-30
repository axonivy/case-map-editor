import { CaseMapViewer, ClientContextProvider, initQueryClient, QueryProvider } from '@axonivy/case-map-editor';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { CaseMapClientMock } from './mock/case-map-client-mock';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found.');
}
const root = ReactDOM.createRoot(rootElement);

const client = new CaseMapClientMock();
const queryClient = initQueryClient();

initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <ReadonlyProvider readonly={true}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <CaseMapViewer context={{ app: '', file: '', pmv: '' }} />
            </HotkeysProvider>
          </ReadonlyProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
