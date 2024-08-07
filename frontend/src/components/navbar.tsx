import { FaHandshake } from "react-icons/fa";

export const NavBar = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center p-4 bg-[#FFE600]">
      <a href="/tickets">
        <h1 className="font-bold text-white text-3xl">Meli Tickets</h1>
      </a>

      <a href="/tickets">
        <FaHandshake size="60" color="white" />
      </a>
    </div>
  );
};
