import { createFileRoute } from "@tanstack/react-router";
import { App } from "@/components/ib/App";
import { StoreProvider } from "@/lib/store";

const title = "Icebreaker — Find common ground before saying hello";
const description =
  "Icebreaker helps you discover the right people at an event — shared interests, skills and goals — before you say hello.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
