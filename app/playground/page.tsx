"use client";

import { FormEvent, useState } from "react";
import { streamComponent } from "./actions";

export default function Playground() {
  const [component, setComponent] = useState<React.ReactNode>();

  const handleClick = async (e: FormEvent) => {
    e.preventDefault();
    const newComponent = await streamComponent("Lahore");
    setComponent(newComponent);
  };

  return (
    <>
      <form onSubmit={handleClick}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Weather
        </button>
      </form>

      <div>{component}</div>
    </>
  );
}
