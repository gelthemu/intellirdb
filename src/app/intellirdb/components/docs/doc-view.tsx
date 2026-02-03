"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { formatDate } from "@/lib/date";
import { Doc } from "@/types";

interface DocViewProps {
  doc: Doc;
}

const DocView: React.FC<DocViewProps> = ({ doc }) => {
  const mdFeed = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) =>
      href?.startsWith("/") ? (
        <Link href={href}>{children}</Link>
      ) : (
        <Link href={href ?? "#"} target="_blank" rel="noopener noreferrer">
          {children}
        </Link>
      ),
    img: ({ src, alt }: { src?: string; alt?: string }) =>
      src &&
      alt && (
        <>
          <Image src={src} alt="" width={1200} height={1200} />
          {alt && (
            <span className="block w-[95%] text-sm opacity-70 mt-1">{alt}</span>
          )}
        </>
      ),
  };

  const renderMarkdown = (content: string) => {
    return (
      <div className="prose prose-lg max-w-xl select-text">
        <Markdown rehypePlugins={[rehypeRaw]} components={mdFeed}>
          {content}
        </Markdown>
      </div>
    );
  };

  if (!doc) return null;

  return (
    <div
      id="doc-view"
      className="w-full h-full overflow-hidden relative overflow-y-auto p-2"
    >
      <div className="w-full overflow-hidden pr-1">
        {doc.publication_date && (
          <div className="w-full text-sm text-right opacity-80 border-b border-dark/40 pb-3 mb-2">
            Posted: {formatDate(doc.publication_date)}
          </div>
        )}
        <article>{renderMarkdown(doc.content)}</article>
      </div>
      <div className="w-full h-24 bg-transparent"></div>
    </div>
  );
};

export { DocView };
