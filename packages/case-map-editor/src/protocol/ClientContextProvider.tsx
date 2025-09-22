import type { ClientContext } from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
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
