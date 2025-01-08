import { StatusEnum } from "@/database/schema";
import { faker } from "@faker-js/faker";
import { Link } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { CircleCheck, CirclePause, CircleX } from "lucide-react";
import { customAlphabet, nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { v7 as uuidv7 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function getStatusIcon(status: Link["status"]) {
  const statusIcons = {
    ACTIVE: CircleCheck,
    INACTIVE: CircleX,
  };

  return statusIcons[status] || CirclePause;
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export function generateRandomLink(): Link {
  return {
    id: uuidv7(),
    code: `LINK-${customAlphabet("0123456789", 4)()}`,
    originalUrl: faker.internet.url(),
    shortUrl: nanoid(8),
    status: faker.helpers.shuffle(StatusEnum.options)[0] ?? "ACTIVE",
    clicks: faker.number.int({ max: 1337 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
