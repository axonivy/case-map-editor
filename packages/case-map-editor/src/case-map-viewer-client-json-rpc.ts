import type { CaseMapContext, CaseMapEditorData, CaseMapViewerClient, RequestTypes } from '@axonivy/case-map-editor-protocol';
import { BaseRpcClient, createMessageConnection, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class CaseMapViewerClientJsonRpc extends BaseRpcClient implements CaseMapViewerClient {
  protected override setupConnection(): void {
    super.setupConnection();
  }

  data(context: CaseMapContext): Promise<CaseMapEditorData> {
    return this.sendRequest('data', context);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-case-map-viewer-lsp');
  }

  public static async startClient(connection: Connection): Promise<CaseMapViewerClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }
  public static async startMessageClient(connection: MessageConnection): Promise<CaseMapViewerClientJsonRpc> {
    const client = new CaseMapViewerClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
