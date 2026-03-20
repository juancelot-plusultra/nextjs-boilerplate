#!/usr/bin/env node

console.log("[v0] Verifying BearFit App Setup...\n");

// Check environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

let allEnvVarsPresent = true;

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✓ ${envVar} is set`);
  } else {
    console.log(`✗ ${envVar} is NOT set`);
    allEnvVarsPresent = false;
  }
});

console.log("\n");

// Check file structure
const fs = require("fs");
const path = require("path");

const criticalFiles = [
  "app/api/auth/signin/route.ts",
  "app/api/auth/signup/route.ts",
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/middleware.ts",
  "components/bearfit/auth-modal.tsx",
  "app/welcome/page.tsx",
  "app/member/dashboard/page.tsx",
  "scripts/setup-schema.sql",
];

console.log("Checking critical files:\n");

let allFilesPresent = true;
criticalFiles.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} is MISSING`);
    allFilesPresent = false;
  }
});

console.log("\n");

// Check for correct env variable usage in critical files
const filesToCheck = [
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/middleware.ts",
];

console.log("Checking for correct environment variable usage:\n");

let allCorrect = true;
filesToCheck.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  const content = fs.readFileSync(filePath, "utf8");

  if (content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    console.log(`✓ ${file} uses NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  } else if (content.includes("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")) {
    console.log(
      `✗ ${file} still uses deprecated NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
    );
    allCorrect = false;
  } else {
    console.log(`? ${file} - could not determine env var usage`);
  }
});

console.log("\n");

// Summary
if (allEnvVarsPresent && allFilesPresent && allCorrect) {
  console.log("✓ All checks passed! App is ready for deployment.");
  process.exit(0);
} else {
  console.log("✗ Some checks failed. Please review the issues above.");
  process.exit(1);
}
