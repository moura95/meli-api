export const Footer = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center p-6 bg-[#FFE600]">
      <p className="font-bold text-white text-1xl">Autor: Guilherme Moura</p>
      <div className="font-bold text-white text-1xl">
        <div className="flex">
          <a
            href="https://www.linkedin.com/in/guilherme-moura95/"
            target="_blank"
            rel="noopener noreferrer"
            className="pr-3"
          >
            <img
              className="h-8"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png?20140125013055"
              alt="linkedin"
            />
          </a>
          <a
            href="https://github.com/moura95/meli-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="h-8"
              src="https://cdn.freebiesupply.com/logos/large/2x/github-icon-1-logo-png-transparent.png"
              alt="github"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
