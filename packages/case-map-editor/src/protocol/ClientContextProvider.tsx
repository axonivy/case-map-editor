import type { ClientContext, ViewerClientContext } from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient, CaseMapViewerClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

const ClientContext = createContext<ClientContext | undefined>(undefined);

export const useClient = (): CaseMapClient => {
  const context = use(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: CaseMapClient; children: ReactNode }) => {
  return <ClientContext value={{ client }}>{children}</ClientContext>;
};

const ViewerClientContext = createContext<ViewerClientContext | undefined>(undefined);

export const useViewerClient = (): CaseMapViewerClient => {
  const context = use(ViewerClientContext);
  if (context === undefined) {
    throw new Error('useViewerClient must be used within a ClientContext');
  }
  return context.client;
};

export const ViewerClientContextProvider = ({ client, children }: { client: CaseMapViewerClient; children: ReactNode }) => {
  return <ViewerClientContext value={{ client }}>{children}</ViewerClientContext>;
};
