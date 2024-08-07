import { NavBar } from "@/components/navbar.tsx";
import { Footer } from "@/components/footer.tsx";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
