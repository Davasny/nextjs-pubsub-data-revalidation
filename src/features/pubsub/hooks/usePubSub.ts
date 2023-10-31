import { useContext } from "react";
import { PubSubContext } from "@/features/pubsub/providers/PubSubProvider";
import type { IPubSubContext } from "@/features/pubsub/types/PubSub";

export const usePubSub = (): IPubSubContext => {
  const ctx = useContext(PubSubContext);

  if (!ctx) {
    throw new Error(
      "usePubSub must be used within an <PubSubContext></PubSubContext> component"
    );
  }

  return ctx;
};
