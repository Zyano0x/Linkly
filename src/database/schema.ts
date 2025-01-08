import { Link } from "@prisma/client";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { z } from "zod";

import { getSortingStateParser } from "@/lib/parsers";

export const StatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Link>().withDefault([
    { id: "createdAt", desc: true },
  ]),
});

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url({ message: "Please enter a valid URL" }),
  clicks: z.number().default(0),
  status: StatusEnum.default("ACTIVE"),
});

export const UpdateLinkSchema = z.object({
  originalUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional(),
  status: StatusEnum.optional(),
});

export type GetLinks = Awaited<ReturnType<typeof searchParamsCache.parse>>;
export type CreateLink = z.infer<typeof CreateLinkSchema>;
export type UpdateLink = z.infer<typeof UpdateLinkSchema>;
