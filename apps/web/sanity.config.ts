"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@rw/sanity/schemas";
import { apiVersion, dataset, projectId } from "@rw/sanity";

export default defineConfig({
  name: "default",
  title: "Rewilding Speech Therapy",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
