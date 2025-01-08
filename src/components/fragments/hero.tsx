import { Unlink } from "lucide-react";

import ShortenForm from "@/components/fragments/shorten-form";

export default function Hero() {
  return (
    <section className={"container pt-8"}>
      <div>
        <div className={"max-w-4xl mx-auto flex flex-col"}>
          <h1 className="text-3xl font-bold tracking-normal leading-tight text-center gap-3 md:text-4xl lg:text-5xl">
            Shorten Links, Boost Impact{" "}
            <span className="inline-block">
              <Unlink
                className="size-5 stroke-[2.5px] md:size-6 lg:size-8"
                aria-hidden="true"
              />
            </span>
          </h1>
          <p className="py-4 text-xs tracking-normal leading-tight text-gray-400 max-w-lg mx-auto text-center md:text-[0.8rem] lg:text-[1rem]">
            Linkly offers a fast, reliable, and user-friendly URL shortening
            service designed to simplify and enhance your online experience.
          </p>
        </div>
      </div>
      <ShortenForm />
    </section>
  );
}
