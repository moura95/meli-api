import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./pages/root.tsx";
import ErrorPage from "./error-page.tsx";
import { Details } from "./pages/tickets/details.tsx";
import { New } from "./pages/tickets/new.tsx";
import { List } from "./pages/tickets/list.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/tickets",
        element: <List />,
      },
      {
        path: "/tickets/:id",
        element: <Details />,
      },
      {
        path: "/tickets/new",
        element: <New />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-svh">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
