export type MessageEvent = 'CREATE';

export interface MessageEventResponder<M> {
  on(event: MessageEvent, message: M): Promise<void>;
}

export interface MessageEventProvider<M> {
  onMessageCreate(handler: (message: M) => Promise<void>): void;
}

export class MessageResponseRunner<M> {
  constructor(provider: MessageEventProvider<M>) {
    provider.onMessageCreate((message) => this.triggerEvent('CREATE', message));
  }

  private async triggerEvent(event: MessageEvent, message: M): Promise<void> {
    await Promise.all(this.responders.map((res) => res.on(event, message)));
  }

  private responders: MessageEventResponder<M>[] = [];

  addResponder(responder: MessageEventResponder<M>) {
    this.responders.push(responder);
  }
}
