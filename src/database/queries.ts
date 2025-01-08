"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/database/index";
import { CreateLink, GetLinks, UpdateLink } from "@/database/schema";
import { Link, Prisma } from "@prisma/client";
import { customAlphabet, nanoid } from "nanoid";

import { getErrorMessage } from "@/lib/handle-error";
import { generateRandomLink } from "@/lib/utils";

export async function trackLink(code: string) {
  try {
    const data = await prisma.$transaction(async (trx) => {
      return trx.link
        .findFirstOrThrow({
          where: {
            shortCode: {
              endsWith: code,
              mode: "insensitive",
            },
            status: {
              equals: "ACTIVE",
            },
          },
        })
        .then((data) => {
          return trx.link.update({
            where: {
              id: data.id,
            },
            data: {
              clicks: {
                increment: 1,
              },
            },
          });
        });
    });

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function seedLinks(input: { count: number }) {
  try {
    const count = input.count ?? 100;
    const allLinks: Link[] = [];

    for (let i = 0; i < count; i++) {
      allLinks.push(generateRandomLink());
    }

    await prisma.link.deleteMany();

    console.log("📝 Inserting tasks", allLinks.length);

    await prisma.link.createMany({
      data: allLinks,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getLinks(input: GetLinks) {
  try {
    const offset = (input.page - 1) * input.perPage;

    // Order by
    const orderBy: Prisma.LinkOrderByWithRelationInput[] = input.sort.map(
      (item) => ({
        [item.id]: item.desc ? "desc" : "asc",
      }),
    );

    const { data, total } = await prisma.$transaction(async (trx) => {
      const data = await trx.link.findMany({
        take: input.perPage,
        skip: offset,
        orderBy,
        select: {
          id: true,
          code: true,
          originalUrl: true,
          shortCode: true,
          clicks: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const total = await trx.link.count();

      return { data, total };
    });

    return {
      data,
      pageCount: Math.ceil(total / input.perPage),
      total,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { data: [], pageCount: 0 };
  }
}

export async function createLink(input: CreateLink) {
  try {
    await prisma.$transaction(async (trx) => {
      const newLink = await trx.link.create({
        data: {
          code: `LINK-${customAlphabet("0123456789", 4)()}`,
          originalUrl: input.originalUrl,
          shortCode: nanoid(8),
          clicks: input.clicks,
          status: input.status,
        },
        select: {
          id: true,
        },
      });

      const oldestLink = await trx.link.findFirst({
        where: {
          id: {
            not: newLink.id,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
        },
      });

      if (oldestLink) {
        await trx.link.delete({
          where: {
            id: oldestLink.id,
          },
        });
      }
    });

    revalidatePath("/");

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function updateLink(input: UpdateLink & { id: string }) {
  try {
    await prisma.$transaction(async (trx) => {
      await trx.link.update({
        where: {
          id: input.id,
        },
        data: {
          originalUrl: input.originalUrl,
          status: input.status,
        },
      });
    });

    revalidatePath("/");

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteLink(input: { id: string }) {
  try {
    await prisma.$transaction(async (trx) => {
      await trx.link.delete({
        where: {
          id: input.id,
        },
      });
    });

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteLinks(input: { ids: string[] }) {
  try {
    await prisma.$transaction(async (trx) => {
      await trx.link.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      const links = input.ids.map(() => generateRandomLink());
      await trx.link.createMany({
        data: links,
      });
    });

    revalidatePath("/");

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}
