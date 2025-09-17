import type { CaseMapEditorDataContext, CaseMapModel, Client, RequestTypes, SaveArgs } from '@axonivy/case-map-editor-protocol';
import { BaseRpcClient, createMessageConnection, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';

export class CaseMapClientJsonRpc extends BaseRpcClient implements Client {
  data(context: CaseMapEditorDataContext): Promise<CaseMapModel> {
    return this.sendRequest('data', context);
  }
  saveData(saveData: SaveArgs): Promise<CaseMapModel> {
    return this.sendRequest('saveData', saveData);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-case-map-lsp');
  }

  public static async startClient(connection: Connection): Promise<CaseMapClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }
  public static async startMessageClient(connection: MessageConnection): Promise<CaseMapClientJsonRpc> {
    const client = new CaseMapClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
