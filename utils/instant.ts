import { init } from "@instantdb/react";
import { InstantDBSchema } from "@/types";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string;

export const db = init<InstantDBSchema>({ appId: APP_ID });
