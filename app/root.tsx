import { useEffect } from "react";
import { json, redirect } from "@remix-run/node"
import {
  Form,
  NavLink,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

//LoaderFunctionArgs: sirve para filtrar por nombre en la lista
import type { LinksFunction, LoaderFunctionArgs, } from "@remix-run/node";

// existing imports
import { createEmptyContact, getContacts } from "./data";
import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

//funcion para filtrar por nombre en lista
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

//creando / editando contactos 
export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function App() {

  const { contacts, q } = useLoaderData<typeof loader>();

  //useNavigation para agregar una IU pendiente global
  const navigation = useNavigation();

  //enviar formulario
  const submit = useSubmit();

  //respuesta inmediata de la interfaz de usuario para la búsqueda
  const searching = navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  //para manipular el valor de la entrada en el DOM directamente
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">

          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form"
              onChange={(event) =>{
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search">
              <input
                aria-label="Search contacts"
                //evitar que la pantalla se desvanezca cuando buscamos
                className={navigation.state === "loading" && !searching ? "loading" : ""}
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" ? "loading" : ""
          }
          id="detail">
          <Outlet />
        </div>


        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
