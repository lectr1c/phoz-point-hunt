import { type Config } from "drizzle-kit";

import { env } from "~/lib/env";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["phoz-point-hunt_*"],
} satisfies Config;
