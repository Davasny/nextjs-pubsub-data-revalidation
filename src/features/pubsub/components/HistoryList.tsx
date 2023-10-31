import { usePubSub } from "@/features/pubsub/hooks/usePubSub";

export const HistoryList = () => {
  const { history } = usePubSub();

  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Event name</th>
          <th>Event type</th>
        </tr>
      </thead>

      <tbody>
        {history.map((event, index) => (
          <tr
            key={index}
            style={{
              border: "1px solid black",
            }}
          >
            <td>{event.timestamp.toISOString()}</td>
            <td>{event.event}</td>
            <td>{event.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
