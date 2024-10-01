import { init } from "@instantdb/react";
import { InstantDBSchema } from "@/types";

// ID for app: Voting App
const APP_ID = "ee543ff6-c9cf-4a8b-9dc0-504994f3860a";

export const db = init<InstantDBSchema>({ appId: APP_ID });
