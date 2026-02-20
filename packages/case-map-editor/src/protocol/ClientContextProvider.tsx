import type { ClientContext, ViewerClientContext } from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient, CaseMapViewerClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

const ClientContextInstance = createContext<ClientContext | undefined>(undefined);

export const useClient = (): CaseMapClient => {
  const context = useContext(ClientContextInstance);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: CaseMapClient; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};

const ViewerClientContextInstance = createContext<ViewerClientContext | undefined>(undefined);

export const useViewerClient = (): CaseMapViewerClient => {
  const context = useContext(ViewerClientContextInstance);
  if (context === undefined) {
    throw new Error('useViewerClient must be used within a ClientContext');
  }
  return context.client;
};

export const ViewerClientContextProvider = ({ client, children }: { client: CaseMapViewerClient; children: ReactNode }) => {
  return <ViewerClientContextInstance.Provider value={{ client }}>{children}</ViewerClientContextInstance.Provider>;
};
