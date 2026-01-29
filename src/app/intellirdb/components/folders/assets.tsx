"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useWindow } from "@/app/contexts/window";
import { getAllDocs } from "@/app/intellirdb/components/docs/docs-parser";
import { DocView } from "@/app/intellirdb/components/docs/doc-view";
import { PageLoader } from "@/app/intellirdb/components/page-loader";
import { formatDate } from "@/lib/date";
import { Visual, Doc } from "@/types";
import data from "@/data/assets.json";
import { cn } from "@/lib/cn";

const Assets: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Doc[]>([]);
  const hasLoadedRef = useRef(false);

  const {
    currentFolder,
    subView,
    deepView,
    openSubView,
    openDeepView,
    setDialogTitle,
  } = useWindow();

  const visuals = data as Visual[];

  const assets = [
    {
      folder: "visuals",
      title: "Visuals",
      array: visuals,
    },
    {
      folder: "docs",
      title: "Docs",
      array: docs,
    },
  ];

  useEffect(() => {
  if (subView === "visuals" && !deepView && !hasLoadedRef.current) {
    setLoading(true);
    hasLoadedRef.current = true;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }
}, [subView, deepView]);

  useEffect(() => {
    const fetchDocs = async () => {
      const docs = await getAllDocs();
      setDocs(docs);
    };
    fetchDocs();
  }, []);

  const selectedAsset = subView
    ? assets.find((a) => a.folder === subView)
    : undefined;

  useEffect(() => {
    if (deepView && selectedAsset) {
      const slug = deepView;
      const doc = docs.find((d) => d.slug === slug);
      if (doc) {
        setDialogTitle(doc.title || "Doc");
      }
      return;
    }

    if (subView && selectedAsset) {
      setDialogTitle(selectedAsset.title || "Asset");
      return;
    }

    if (currentFolder === "assets") {
      setDialogTitle("Assets");
    }
  }, [subView, selectedAsset, currentFolder, setDialogTitle]);

  const handleFolderClick = (folder: string) => {
    openSubView(folder);
  };

  const handleItemClick = (id: string) => {
    const slug = id.toLowerCase().replace(/\s+/g, "-");
    openDeepView(slug);
  };

  if (subView?.startsWith("visuals") && deepView) {
    const visualId = deepView;
    const visual = visuals.find(
      (v) => v.title.toLowerCase().replace(/\s+/g, "-") === visualId,
    );

    if (!visual) return null;

    return (
      <div
        id="visual-view"
        className="relative w-full h-full flex items-center justify-center bg-beige/40 p-px"
        onDoubleClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="w-full h-full relative border-none overflow-hidden">
          <Image
            src={visual.url}
            alt=""
            fill
            className="w-full h-full object-contain intelli-none grayscale"
            unoptimized
          />
          <div className="absolute inset-0 pointer-events-none grayscale opacity-80">
            <div
              className="absolute inset-0 bg-dark/20"
              style={{
                backgroundImage:
                  "url('https://assets.cfmpulse.com/intellirdb/assets/tl..webp')",
                backgroundRepeat: "repeat",
                backgroundSize: "contain",
                opacity: 1,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (subView?.startsWith("docs") && deepView) {
    const docId = deepView;
    const doc = docs.find((d) => d.slug === docId);

    if (!doc) return null;

    return <DocView doc={doc} />;
  }

  if (subView === "visuals") {
    return (
      <div
        className={cn(
          "w-full h-full relative p-px pr-1 overflow-hidden",
          loading ? "" : "overflow-y-auto",
        )}
      >
        {loading && <PageLoader />}
        {visuals.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 z-[9]">
            {visuals.map((visual, index) => (
              <Suspense key={index} fallback={null}>
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleItemClick(visual.title);
                  }}
                  className="relative flex flex-col gap-1 overflow-hidden cursor-pointer break-inside-avoid"
                >
                  <div className="w-full relative border border-dark overflow-hidden">
                    {visual.url && (
                      <Image
                        src={visual.url}
                        alt=""
                        width={1500}
                        height={1500}
                        className="w-full h-auto object-contain intelli-none grayscale"
                        unoptimized
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 pointer-events-none grayscale">
                      <div
                        className="absolute inset-0 bg-dark/20"
                        style={{
                          backgroundImage:
                            "url('https://assets.cfmpulse.com/intellirdb/assets/tl..webp')",
                          backgroundRepeat: "repeat",
                          backgroundSize: "cover",
                          opacity: 1,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full text-left">
                    <small className="font-medium text-left">{`IMG-MGMG9797-${visual.title}`}</small>
                  </div>
                </div>
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2 z-[9]">
            <span className="text-sm text-center">
              No visuals found... yet!
            </span>
          </div>
        )}
        <div className="w-full h-16 bg-transparent"></div>
      </div>
    );
  }

  if (subView === "docs") {
    return (
      <div className="w-full h-full relative p-px pr-1 overflow-hidden overflow-y-auto">
        {docs.length > 0 ? (
          <div className="space-y-2">
            {docs.map((doc, index) => (
              <div
                key={doc.slug}
                className="px-3 py-2 border border-dark/50 cursor-pointer select-none"
                onClick={() => handleItemClick(doc.slug)}
              >
                <div className="flex flex-col">
                  <div className="font-bold font-var">{doc.title}</div>
                  <div className="font-retro">{`${doc.slug}.txt`}</div>
                  {doc.publication_date && (
                    <div className="text-sm opacity-70">
                      Posted: {formatDate(doc.publication_date)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2">
            <span className="text-sm text-center">No docs found... yet!</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="relative w-full h-full z-[0] overflow-hidden overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {assets.map((asset) => (
            <div
              key={asset.folder}
              className="w-fit flex flex-row items-end gap-2 cursor-pointer"
              onClick={() => handleFolderClick(asset.folder)}
            >
              <div className="w-10 aspect-square flex items-center justify-center">
                <Image
                  src="/folders/img-assets.png"
                  alt=""
                  width={1500}
                  height={1500}
                  unoptimized
                  className="w-full h-full object-contain intelli-none"
                />
              </div>
              <div className="pb-1 font-semibold text-sm">
                <span>
                  {asset.title}{" "}
                  <span className="text-sm opacity-60">
                    {asset.array.length > 0 && `(${asset.array.length})`}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assets;
