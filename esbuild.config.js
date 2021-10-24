#!/usr/bin/env node

import esbuildServe from "esbuild-serve";

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["example/main.ts"],
    bundle: true,
    outfile: "docs/main.js",
    sourcemap: true,
  },
  { root: "docs" }
);