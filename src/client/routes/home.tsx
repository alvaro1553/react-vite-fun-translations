import type { Route } from "./+types/home";
import { Link } from "react-router";
import { WelcomePage } from "../components/pages/WelcomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fun Translations by Alvaro" },
    {
      name: "description",
      content:
        "A playful landing page showcasing how the coding challenge was solved: structure, services, caching, and UI — with a fun Alvaro twist.",
    },
  ];
}

export default function Home() {
  return (
    <WelcomePage>
      <p className="mt-2 text-zinc-600">
        Ready to try it out? Check out the solution {" "}
        <Link
          to="/translate"
          className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          here
        </Link>
        .
      </p>
      <p className="mt-2 text-zinc-600">
        Prefer to inspect or run it locally? Check out the {" "}
        <a
          href="https://github.com/alvaro1553/react-vite-fun-translations"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          repository
        </a>{" "}
        or {" "}
        <a
          href="/main.tar.gz"
          download
          className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          download
        </a>{" "}
        it (main.tar.gz).
      </p>
    </WelcomePage>
  );
}
