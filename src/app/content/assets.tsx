"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useStack } from "@/app/hooks/use-dialog-stack";
import data from "@/data/assets.json";
import { Asset } from "@/types";

interface AssetsProps {
  isOpen?: boolean;
}

const assetsData = data as Asset[];

export const assets: Asset[] = assetsData;

export function AssetView({ asset }: { asset: Asset }) {
  return (
    <div
      id="asset-view"
      className="relative w-full h-full flex items-center justify-center bg-beige/10 p-px"
      onDoubleClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
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
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {assets.map((asset, index) => (
            <Suspense key={index} fallback={null}>
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAssetClick(asset);
                }}
                className="relative flex flex-col items-center gap-1 overflow-hidden cursor-pointer break-inside-avoid"
              >
                <div className="w-full relative border border-dark overflow-hidden">
                  {asset.url && (
                    <Image
                      src={asset.url}
                      alt={asset.title}
                      width={1500}
                      height={1500}
                      className="w-full h-auto object-contain intelli-none grayscale"
                      unoptimized
                      loading="lazy"
                    />
                  )}
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
      <div className="w-full h-32 bg-transparent"></div>
    </div>
  );
}
