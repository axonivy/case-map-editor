import type {
  CaseMapContext,
  CaseMapEditorData,
  CaseMapNotificationTypes,
  EditorFileContent,
  Event,
  MetaRequestTypes,
  RequestTypes,
  SaveArgs
} from '@axonivy/case-map-editor-protocol';
import type { CaseMapClient } from '@axonivy/case-map-editor-protocol/src/case-map-client';
import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';

export class CaseMapClientJsonRpc extends BaseRpcClient implements CaseMapClient {
  protected onAnimateEmitter = new Emitter<void>();
  onAnimate: Event<void> = this.onAnimateEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.onNotification('animate', data => {
      this.onAnimateEmitter.fire(data);
    });
  }

  initialize(context: CaseMapContext): Promise<boolean> {
    this.sendRequest('initialize', context);
    return Promise.resolve(true);
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  data(context: CaseMapContext): Promise<CaseMapEditorData> {
    return this.sendRequest('data', context);
  }
  saveData(saveData: SaveArgs): Promise<EditorFileContent> {
    return this.sendRequest('saveData', saveData);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNotification<K extends keyof CaseMapNotificationTypes>(kind: K, listener: (args: CaseMapNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
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
