import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EccommerceRoute } from "./routes/router";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <EccommerceRoute />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
