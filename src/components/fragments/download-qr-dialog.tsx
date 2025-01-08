"use client";

import React from "react";
import { Link } from "@prisma/client";
import { Loader } from "lucide-react";
import QRCodeStyling, {
  ErrorCorrectionLevel,
  Mode,
  Options,
  TypeNumber,
} from "qr-code-styling";
import { toast } from "sonner";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface DownloadTasksDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  link: Link | null;
}

const options: Options = {
  width: 300,
  height: 300,
  type: "svg",
  data: "https://example.com",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  dotsOptions: {
    color: "#6a1a4c",
    type: "rounded",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#9bafd9" },
        { offset: 1, color: "#103783" },
      ],
    },
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#595cff" },
        { offset: 1, color: "#c6f8ff" },
      ],
    },
  },
  backgroundOptions: {
    color: "#e9ebee",
  },
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: "Byte" as Mode,
    errorCorrectionLevel: "Q" as ErrorCorrectionLevel,
  },
  imageOptions: {
    saveAsBlob: true,
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 20,
    crossOrigin: "anonymous",
  },
};

export function DownloadQrDialog({ link, ...props }: DownloadTasksDialogProps) {
  const [isDownloadPending, startDownloadTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDownload() {
    startDownloadTransition(async () => {
      if (!link) return;

      const updatedOptions = {
        ...options,
        data: `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortCode}`,
      };
      const qrCode = new QRCodeStyling(updatedOptions);
      await qrCode.download({ extension: "png" });

      props.onOpenChange?.(false);
      toast.success("QR downloaded");
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you want to download QR Code?</DialogTitle>
            <DialogDescription>
              This action will generate and download a QR code of this link to
              your computer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Download QR selected rows"
              variant="default"
              onClick={onDownload}
              disabled={isDownloadPending}
            >
              {isDownloadPending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action will generate and download a QR code of this link to
            your computer.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Download QR selected rows"
            variant="default"
            onClick={onDownload}
            disabled={isDownloadPending}
          >
            {isDownloadPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Download
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
