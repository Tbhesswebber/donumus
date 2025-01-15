import { drizzle } from "drizzle-orm/xata-http";

import { getXataClient } from "./xata.gen";

const xata = getXataClient();
export const db = drizzle(xata);
