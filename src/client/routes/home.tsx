import type { Route } from "./+types/home";
import {Link} from "react-router";
import {WelcomePage} from "../components/pages/WelcomePage";

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
        Ready to try it out? Check out {" "}
        <Link to="/translate" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
          the solution here
        </Link>
        .
      </p>
    </WelcomePage>
  )
}
