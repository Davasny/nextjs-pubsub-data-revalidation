# nextjs-pubsub-data-revalidation

This repository is proof of concept of implementing PubSub architecture in react using react context, swr and wretch.

## Motivation

Sometimes it's needed to revalidate data fetched and displayed by components that were mounted and possibly will be
mounted again in the future. For example, user goes to list of some resources, then goes to page where can create new
resource, then gets back to list of resources.

What happened here is:

1. List of resources (mount some component `List`, mount hooks like `useGetApi`, fetch data by those hooks)
2. Go to create page (mount new component `Create`, mount hooks like `useUpdateApi`, unmount `List` and `useGetApi`)
3. Create resource (use `useUpateApi`)
4. Go back to list of resources (mount `List` and `useGetApi` again)

The problem is in step 3. where there is no way to notify `List` component that data has changed and it should be
revalidated.

In case of using eventEmitter and eventListner it would be:

3. Create resource (use `useUpateApi`), and emit event `resourceCreated`
4. Go back to list of resources (mount `List` and `useGetApi` again), and listen to event `resourceCreated`

But in fact `List` and `useGetApi` were not mounted when event was emitted, so it didn't get notified.

## Solution

To achieve expected behaviour, we need to store events somewhere and then notify components during their mount phase.

## Implementation

This project shows how to use PubSub pattern and simplified actor's model mailboxes to store events and notify
unmounted (that will probably mount again in the future) about need of data revalidation.

### Assumptions

Publisher - some hook or component that can notify others about need of data revalidation
Subscriber - some hook or component that can be notified about need of data revalidation

1. Publisher can emit event only when it's mounted
2. Publisher can emit only one event at a time
3. Single event can be delivered to multiple subscribers
4. Subscribers are ephemeral, they can be mounted and unmounted multiple times
5. Subscribers doesn't store it's state
6. When subscriber mounts, it should be notified about all events that were emitted when it was unmounted
7. When subscriber is mounted, it should react in real time to events emitted by publishers
8. When subscriber is unmounted, it should stop reacting to events emitted by publishers

### Example implementation

1. Application is wrapped by `PubSubProvider` which contains logic of subscription, unsubscription and notification
   processes

```tsx
// _app.tsx
const App = ({Component, pageProps}: AppProps) => (
  <PubSubProvider>
    <SWRConfig>
      <Component {...pageProps} />
    </SWRConfig>
  </PubSubProvider>
);
```

2. Hooks responsible for fetching data subscribes and unsubscribes to events

```tsx
export const useGetApiData = (url: string) => {
  // ... some code to fetch data

  // some method to revalidate data
  const mutate = () => {
  }

  const {subscribe, unSubscribe} = usePubSub();

  useEffect(() => {
    const events: IEvent[] = ["USER_CREATED", "USER_DELETED"];
    subscribe({
      events: events,
      url: url,
      callback: () => {
        mutate();
      },
    });

    return () => {
      unSubscribe({
        events: events,
        url: url,
        callback: () => {
          mutate();
        },
      });
    };
  }, [mutate, subscribe, unSubscribe, url]);

  return {data, isLoading, error};
};
```

3. Hooks or component responsible for data updated emits event

```tsx
export const RefreshButtons = () => {
  const {dispatch} = usePubSub();

  return (
    <div>
      <button
        onClick={() => {
          dispatch("USER_CREATED");
        }}
      >
        emit event
      </button>
    </div>
  );
};
```

### Internals

Take a look at comments in [PubSubProvider.tsx](./src/features/pubsub/providers/PubSubProvider.tsx)

## How to run

```bash
pnpm install
pnpm run dev
```

To see exact behaviour, open network tab in dev tools and see observe requests to `/api/dummy`
