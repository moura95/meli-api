import { Outlet, useLocation, Navigate } from "react-router-dom";

function App() {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/tickets") {
    return <Navigate to="/tickets/list" />;
  } else {
    return <Outlet />;
  }
}

export default App;