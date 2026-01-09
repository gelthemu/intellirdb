"use client";

import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useWindow } from "@/app/contexts/window";
import data from "@/data/assets.json";
import docsData from "@/data/docs.json";
import { Visual, Doc } from "@/types";

const visuals = data as Visual[];

const docs = docsData as Doc[];

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

const Assets: React.FC = () => {
  const {
    currentFolder,
    subView,
    deepView,
    openSubView,
    openDeepView,
    setDialogTitle,
  } = useWindow();

  const selectedAsset = subView
    ? assets.find((a) => a.folder === subView)
    : undefined;

  useEffect(() => {
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
      (v) => v.title.toLowerCase().replace(/\s+/g, "-") === visualId
    );

    if (!visual) return null;

    return (
      <div
        id="visual-view"
        className="relative w-full h-full flex items-center justify-center bg-beige/10 p-px"
        onDoubleClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Image
          src={visual.url}
          alt={visual.title}
          fill
          className="object-contain intelli-none"
          unoptimized
        />
      </div>
    );
  }

  if (subView?.startsWith("docs") && deepView) {
    const docId = deepView;
    const doc = docs.find((d) => d.id === docId);

    if (!doc) return null;

    const renderMarkdown = (content: string) => {
      return content;
    };

    return (
      <div
        id="doc-view"
        className="relative w-full h-full flex items-center justify-center bg-beige/10 p-px"
      >
        <article>{renderMarkdown(doc.content)}</article>
      </div>
    );
  }

  if (subView === "visuals") {
    return (
      <div className="w-full h-full p-px overflow-hidden overflow-y-auto pr-1">
        {visuals.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {visuals.map((visual, index) => (
              <Suspense key={index} fallback={null}>
                <motion.div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleItemClick(visual.title);
                  }}
                  className="relative flex flex-col items-center gap-1 overflow-hidden cursor-pointer break-inside-avoid"
                >
                  <div className="w-full relative border border-dark overflow-hidden">
                    {visual.url && (
                      <Image
                        src={visual.url}
                        alt={visual.title}
                        width={1500}
                        height={1500}
                        className="w-full h-auto object-contain intelli-none grayscale"
                        unoptimized
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 pointer-events-none grayscale">
                      <div
                        className="absolute inset-0 bg-black/20"
                        style={{
                          backgroundImage: "url('/tl..webp')",
                          backgroundRepeat: "repeat",
                          backgroundSize: "cover",
                          opacity: 1,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-center">{visual.title}</span>
                </motion.div>
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2">
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
      <div className="w-full h-full p-0 overflow-hidden relative overflow-y-auto pr-1">
        {docs.length > 0 ? (
          <div className="space-y-2">
            {docs.map((doc, index) => (
              <motion.div
                key={doc.id}
                className="px-3 py-2 border border-dark/50 cursor-pointer select-none"
                onClick={() => handleItemClick(doc.id)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.5 }}
              >
                <div className="flex flex-col">
                  <div className="font-bold">{doc.name}</div>
                  <div>{doc.filename}</div>
                </div>
              </motion.div>
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
            <motion.div
              key={asset.folder}
              className="w-fit flex flex-row items-end gap-2 cursor-pointer"
              onClick={() => handleFolderClick(asset.folder)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              <div className="pb-1 text-sm">
                <span>
                  {asset.title}{" "}
                  <span className="text-sm opacity-60">
                    {asset.array.length > 0 && `(${asset.array.length})`}
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assets;
