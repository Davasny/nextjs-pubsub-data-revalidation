import { usePubSub } from "@/features/pubsub/hooks/usePubSub";

export const RefreshButtons = () => {
  const { dispatch } = usePubSub();

  return (
    <div>
      <button
        onClick={() => {
          dispatch("USER_CREATED");
        }}
      >
        USER_CREATED
      </button>

      <button
        onClick={() => {
          dispatch("USER_DELETED");
        }}
      >
        USER_DELETED
      </button>
    </div>
  );
};
