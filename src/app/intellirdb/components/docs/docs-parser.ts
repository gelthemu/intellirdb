"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Doc } from "@/types";

const directory = path.join(process.cwd(), "src", "data", "docs");

export async function getAllDocs(): Promise<Doc[]> {
  const fileNames = fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"));
  const docs: Doc[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title as string,
      publication_date: (data.publication_date as string) || null,
      content,
    };
  });

  return docs.sort((a, b) => {
    const dateA = a.publication_date
      ? new Date(a.publication_date)
      : new Date(0);
    const dateB = b.publication_date
      ? new Date(b.publication_date)
      : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
}
