import type { AppProps } from "next/app";
import { PubSubProvider } from "@/features/pubsub/providers/PubSubProvider";
import { SWRConfig } from "swr";

const App = ({ Component, pageProps }: AppProps) => (
  <PubSubProvider>
    <SWRConfig>
      <Component {...pageProps} />
    </SWRConfig>
  </PubSubProvider>
);

export default App;
