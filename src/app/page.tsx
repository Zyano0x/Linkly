import React from "react";
import { getLinks } from "@/database/queries";
import { searchParamsCache } from "@/database/schema";
import { SearchParams } from "@/types";

import Hero from "@/components/fragments/hero";
import LinkTable from "@/components/fragments/link-table";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const data = await getLinks({ ...search });

  return (
    <>
      <Hero />
      <LinkTable result={data} />
    </>
  );
}
