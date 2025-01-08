import { Unlink } from "lucide-react";

import ShortenForm from "@/components/fragments/shorten-form";

export default function Hero() {
  return (
    <section className={"container pt-8"}>
      <div>
        <div className={"max-w-4xl mx-auto flex flex-col"}>
          <h1 className="text-5xl font-bold tracking-normal leading-tight flex items-center justify-center gap-3">
            Shorten Links, Boost Impact{" "}
            <span className="inline-block">
              <Unlink className="size-8 stroke-[2.5px]" aria-hidden="true" />
            </span>
          </h1>
          <p className="py-4 text-base text-gray-400 max-w-lg mx-auto text-center">
            Linkly offers a fast, reliable, and user-friendly URL shortening
            service designed to simplify and enhance your online experience.
          </p>
        </div>
      </div>
      <ShortenForm />
    </section>
  );
}
