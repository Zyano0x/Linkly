import { notFound, redirect } from "next/navigation";
import { trackLink } from "@/database/queries";

interface RedirectPageProps {
  params: Promise<{ shortUrl: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortUrl } = await params;
  const { data, error } = await trackLink(shortUrl);

  if (!data || error) {
    return notFound();
  }

  redirect(data.originalUrl);
}
