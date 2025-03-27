import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setProject("67e558b7003c1c7219ae");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);