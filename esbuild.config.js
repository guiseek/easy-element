#!/usr/bin/env node

import esbuildServe from "esbuild-serve";

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["src/main.ts"],
    bundle: true,
    outfile: "public/main.js",
    sourcemap: true,
  },
  { root: "public" }
);