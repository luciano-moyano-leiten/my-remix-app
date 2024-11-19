
//eliminacion de registros, lo siguiente voy a necesitar:
//en primer lugar crear la ruta: app/routes/contacts.\$contactId_.destroy.tsx
//1- Una nueva ruta
//2- Un actionen esa ruta
//3- deleteContact de app/data.ts
//4- redirect A algún lugar después


import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  await deleteContact(params.contactId);
  return redirect("/");
};
