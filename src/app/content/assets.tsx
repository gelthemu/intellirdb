"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useStack } from "@/app/hooks/use-dialog-stack";
import { Asset } from "@/types";

interface AssetsProps {
  isOpen?: boolean;
}

export const assets: Asset[] = [];

export function AssetView({ asset }: { asset: Asset }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-beige/10 p-px">
      <Image
        src={asset.url}
        alt={asset.title}
        fill
        className="object-contain intelli-none"
        unoptimized
      />
    </div>
  );
}

export function Assets({ isOpen = true }: AssetsProps) {
  const { openDialog } = useStack();

  if (!isOpen) return null;

  const handleAssetClick = (asset: Asset) => {
    openDialog({
      id: `asset-${asset.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: asset.title,
      component: <AssetView asset={asset} />,
    });
  };

  return (
    <div className="w-full h-full p-px overflow-hidden overflow-y-auto">
      {assets.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {assets.map((asset, index) => (
            <Suspense key={index} fallback={null}>
              <div
                key={index}
                onClick={() => handleAssetClick(asset)}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="w-full aspect-square relative border border-dark overflow-hidden">
                  <Image
                    src={asset.url}
                    alt={asset.title}
                    fill
                    className="w-full h-full object-cover intelli-none"
                    unoptimized
                  />
                </div>
                <span className="text-sm text-center">{asset.title}</span>
              </div>
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-center">No assets found</span>
        </div>
      )}
    </div>
  );
}
