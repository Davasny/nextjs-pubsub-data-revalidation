export type IEvent = "USER_CREATED" | "USER_DELETED";
export type IEventId = `${IEvent} - ${string}`;

export type ISubscriber = {
  /**
   * url that is this subscriber responsible for
   * */
  url: string;
  events: IEvent[];
  callback: () => void;
};

export type ISubscribe = (subscriber: ISubscriber) => void;

export type IDispatch = (event: IEvent) => void;

export type MailBox = {
  /**
   * event name + url
   * */
  id: IEventId;
  event: IEvent;
  url: string;
  /**
   * if callback is present, then call callback after propagating event
   * if callback is not present, then just save message in mailbox
   * */
  callback?: () => void;
  /**
   * when shouldBeExecuted is true, subscriber should execute callback on mount and set to false after execution
   * */
  shouldBeExecuted: boolean;
};

export type MailBoxes = MailBox[];

export type IHistoryEventType = "EVENT_EMITTED" | "EVENT_RECEIVED";
export type IHistoryEntry = {
  timestamp: Date;
  event: IEvent;
  type: IHistoryEventType;
};

export type IHistory = IHistoryEntry[];

export interface IPubSubContext {
  /**
   * Subscribe to list of specified events, if any event is emitted, then callback is called
   * */
  subscribe: ISubscribe;

  /**
   * Remove subscriber and don't react to any events
   * */
  unSubscribe: ISubscribe;

  /**
   * Send event to all its subscribers
   * */
  dispatch: IDispatch;

  /**
   * List of historical events
   * */
  history: IHistory;
}
