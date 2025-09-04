import type { PendingMutation } from "@tanstack/react-db";

import { authCollection } from "./db/collections";
import type { User } from "./db/schema";

type SignInResult = Pick<User, "id" | "name">;

type IngestPayload = {
  mutations: Omit<PendingMutation, "collection">[];
};

const authHeaders = (): { authorization: string } | {} => {
  const auth = authCollection.get("current");

  return auth !== undefined ? { authorization: `Bearer ${auth.user_id}` } : {};
};

const reqHeaders = () => {
  return {
    "content-type": "application/json",
    accept: "application/json",
    ...authHeaders(),
  };
};

export async function signIn(
  username: string,
  avatarUrl: string | undefined,
): Promise<string | undefined> {
  const data = {
    avatar_url: avatarUrl !== undefined ? avatarUrl : null,
    username,
  };
  const headers = reqHeaders();

  const response = await fetch("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  if (response.ok) {
    const { id: user_id }: SignInResult = await response.json();
    return user_id;
  }
}

export async function ingest(
  payload: IngestPayload,
): Promise<number | undefined> {
  const headers = reqHeaders();

  const response = await fetch("/ingest/mutations", {
    method: "POST",
    body: JSON.stringify(payload),
    headers,
  });

  if (response.ok) {
    const data = await response.json();
    const txid = data.txid as string | number;
    const txidInt = typeof txid === "string" ? parseInt(txid, 10) : txid;

    return txidInt;
  }
}
