import { useState } from "react";
import { RefreshButtons } from "@/components/RefreshButtons";
import { ShowData } from "@/components/ShowData";
import { HistoryList } from "@/features/pubsub/components/HistoryList";

const IndexPage = () => {
  const [showData, setShowData] = useState(false);

  return (
    <div>
      <button onClick={() => setShowData(!showData)}>
        {showData ? "hide" : "show"}
      </button>

      {showData && <ShowData />}

      <RefreshButtons />

      <HistoryList />
    </div>
  );
};

export default IndexPage;
