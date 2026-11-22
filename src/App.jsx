import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sileo";
import { notificationStyles } from "./lib/notify";
import { EccommerceRoute } from "./routes/router";

import { AuthProvider } from "./auth/AuthProvider";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EccommerceRoute />
      </AuthProvider>
      {createPortal(
        <Toaster position="top-right" offset={{ top: 72 }} options={notificationStyles} />,
        document.getElementById("commerce-notifications"),
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
