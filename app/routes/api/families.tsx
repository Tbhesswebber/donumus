import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/families")({
  GET: ({ params, request }) => {
    return json({ message: 'Hello "/api/families"!' });
  },
  POST: () => {
    return json({ message: 'Hello "/api/families"!' });
  },
});
