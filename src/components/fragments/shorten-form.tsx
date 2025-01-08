"use client";

import React from "react";
import { createLink } from "@/database/queries";
import { CreateLink, CreateLinkSchema } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ShortenForm() {
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreateLink>({
    resolver: zodResolver(CreateLinkSchema),
    defaultValues: {
      originalUrl: "",
      clicks: 0,
      status: "ACTIVE",
    },
  });

  function onSubmit(values: CreateLink) {
    startCreateTransition(async () => {
      const { error } = await createLink(values);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      toast.success("Link created");
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="originalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">URL</FormLabel>
              <FormControl>
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-2.5">
                    <Link className="h-5" />
                  </div>
                  <Input
                    placeholder="https://example.com/my-long-link"
                    {...field}
                    className="h-12 pl-10 pr-28 rounded-lg text-base"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 w-20"
                    disabled={isCreatePending}
                  >
                    {isCreatePending && (
                      <Loader
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Shorten
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
