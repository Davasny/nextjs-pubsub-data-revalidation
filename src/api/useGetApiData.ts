import useSWR from "swr";
import type { WretchError } from "wretch";
import wretch from "wretch";
import type { BackendResponse } from "@/types/backendResponse";
import { usePubSub } from "@/features/pubsub/hooks/usePubSub";
import { useEffect } from "react";
import type { IEvent } from "@/features/pubsub/types/PubSub";

const dummyDataFetcher = (url: string) =>
  wretch().url(url).get().json<BackendResponse>();

export const useGetApiData = (url: string) => {
  const { data, isLoading, error, mutate } = useSWR<
    BackendResponse,
    WretchError
  >(url, () => dummyDataFetcher(url), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const { subscribe, unSubscribe } = usePubSub();

  useEffect(() => {
    const events: IEvent[] = ["USER_CREATED", "USER_DELETED"];
    subscribe({
      events: events,
      url: url,
      callback: () => {
        void mutate();
      },
    });

    return () => {
      unSubscribe({
        events: events,
        url: url,
        callback: () => {
          void mutate();
        },
      });
    };
  }, [mutate, subscribe, unSubscribe, url]);

  return { data, isLoading, error };
};
