import { args } from "../args.js";
import { resolveDirs } from "../resolveDirs.js";
import { createLinkPackages } from "./createLinkPackages/createLinkPackages.js";

(async () => {
  const dirs = resolveDirs(args);
  // Create link packages for all SmartBundle-bundled projects
  await createLinkPackages(dirs);

  console.log("Monorepo link packages created successfully");
  console.log("Run 'pnpm install' to update dependencies");
})();
