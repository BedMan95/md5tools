import { serve } from "bun";
import index from "./index.html";
import { md5Reverse } from "./lib/md5-reverse";

const server = serve({
  routes: {
    "/*": index,
    "/api/md5/reverse/:hash": async (req) => {
      return await md5Reverse(req);
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);

