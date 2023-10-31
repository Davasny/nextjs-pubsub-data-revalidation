import type { ReactNode } from "react";
import { createContext, useCallback, useRef, useState } from "react";
import type {
  IEvent,
  IEventId,
  IHistory,
  IHistoryEventType,
  IPubSubContext,
  ISubscribe,
  ISubscriber,
  MailBoxes,
} from "@/features/pubsub/types/PubSub";

export const PubSubContext = createContext<IPubSubContext | null>(null);

export const PubSubProvider = ({ children }: { children: ReactNode }) => {
  // changes in mailboxes should not trigger rerender
  const mailBoxes = useRef<MailBoxes>([]);

  // changes in history should trigger rerender as it's used to show history component
  const [history, setHistory] = useState<IHistory>([]);

  const appendToHistory = (event: IEvent, type: IHistoryEventType) => {
    setHistory((oldHistory) => [
      ...oldHistory,
      { timestamp: new Date(), event, type },
    ]);
  };

  const getMailBoxId = (event: IEvent, url: string): IEventId =>
    `${event} - ${url}`;

  /**
   * Create or update mailbox associated with provided subscriber
   * */
  const subscribe = useCallback<ISubscribe>(
    (subscriber: ISubscriber) => {
      let shouldExecuteCallback = false;

      subscriber.events.forEach((event) => {
        const mailBoxId = getMailBoxId(event, subscriber.url);
        const mailBox = mailBoxes.current.find(
          (mailBox) => mailBox.id === mailBoxId
        );

        if (mailBox) {
          // if mailbox exists, then update callback and check if shouldBeExecuted is true
          mailBox.callback = subscriber.callback;
          if (mailBox.shouldBeExecuted) {
            // when shouldBeExecuted is true, then plan callback execution after loop
            mailBox.shouldBeExecuted = false;
            shouldExecuteCallback = true;
            appendToHistory(event, "EVENT_RECEIVED");
          }
        } else {
          // create new mailbox
          mailBoxes.current.push({
            id: mailBoxId,
            event: event,
            url: subscriber.url,
            callback: subscriber.callback,
            shouldBeExecuted: false,
          });
        }
      });

      // if at least one event was emitted to any mailbox, then execute callback once
      if (shouldExecuteCallback) {
        subscriber.callback();
      }
    },
    [mailBoxes]
  );

  /**
   * Remove callback from existing mailboxes associated with provided subscriber
   * */
  const unSubscribe = useCallback<ISubscribe>(
    (subscriber) => {
      subscriber.events.forEach((event) => {
        const mailBoxId = getMailBoxId(event, subscriber.url);

        const mailBox = mailBoxes.current.find(
          (mailBox) => mailBox.id === mailBoxId
        );

        if (mailBox) {
          mailBox.callback = undefined;
        }
      });
    },
    [mailBoxes]
  );

  /**
   * Send event to all mailboxes associated with it
   * */
  const dispatch = (event: IEvent) => {
    // get only mailboxes associated with dispatched event
    const mailBoxesToExecute = mailBoxes.current.filter(
      (mailBox) => mailBox.event === event
    );

    mailBoxesToExecute.forEach((mailBox) => {
      appendToHistory(event, "EVENT_EMITTED");
      if (mailBox.callback) {
        // if mailbox has callback, then execute it
        mailBox.callback();
        appendToHistory(event, "EVENT_RECEIVED");
      } else {
        // if mailbox has no callback, then set shouldBeExecuted flag to true
        // so it will be executed when subscriber will be back
        mailBox.shouldBeExecuted = true;
      }
    });
  };

  return (
    <PubSubContext.Provider
      value={{
        subscribe,
        unSubscribe,
        dispatch,
        history,
      }}
    >
      {children}
    </PubSubContext.Provider>
  );
};
