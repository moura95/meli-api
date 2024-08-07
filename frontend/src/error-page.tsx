// @ts-nocheck
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      className="flex items-center justify-center flex-col h-svh"
      id="error-page"
    >
      <h1>Page!</h1>

      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
