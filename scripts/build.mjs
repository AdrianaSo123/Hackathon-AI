import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import nunjucks from "nunjucks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const contentPath = path.join(rootDir, "content", "site.yaml");
const templatesDir = path.join(rootDir, "templates");
const assetsDir = path.join(rootDir, "assets");
const distDir = path.join(rootDir, "dist");

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function splitParagraphs(value) {
  if (typeof value !== "string") return [];
  return value
    .split(/\n\s*\n/g)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

async function readYaml(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const data = yaml.load(raw);
  if (!data || typeof data !== "object") {
    throw new Error("content YAML is empty or invalid");
  }
  return data;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(from, to);
        return;
      }
      if (entry.isFile()) {
        await fs.copyFile(from, to);
      }
    })
  );
}

async function emptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const site = await readYaml(contentPath);

  // Basic validation so a fresh fork fails loudly.
  assertNonEmptyString(site?.site?.name, "site.name");
  assertNonEmptyString(site?.site?.title, "site.title");
  assertNonEmptyString(site?.site?.tagline, "site.tagline");
  assertNonEmptyString(site?.site?.description, "site.description");
  if (!Array.isArray(site?.ui?.navigation) || site.ui.navigation.length === 0) {
    throw new Error("ui.navigation must be a non-empty array");
  }
  assertNonEmptyString(site?.ui?.sections?.about_title, "ui.sections.about_title");
  assertNonEmptyString(site?.ui?.sections?.services_title, "ui.sections.services_title");
  assertNonEmptyString(site?.ui?.sections?.process_title, "ui.sections.process_title");
  assertNonEmptyString(site?.ui?.sections?.contact_title, "ui.sections.contact_title");
  assertNonEmptyString(site?.ui?.labels?.email, "ui.labels.email");
  assertNonEmptyString(site?.ui?.labels?.linkedin, "ui.labels.linkedin");
  assertNonEmptyString(site?.hero?.headline, "hero.headline");
  assertNonEmptyString(site?.hero?.subheadline, "hero.subheadline");
  assertNonEmptyString(site?.hero?.primary_cta?.label, "hero.primary_cta.label");
  assertNonEmptyString(site?.hero?.primary_cta?.href, "hero.primary_cta.href");
  assertNonEmptyString(site?.hero?.secondary_cta?.label, "hero.secondary_cta.label");
  assertNonEmptyString(site?.hero?.secondary_cta?.href, "hero.secondary_cta.href");
  assertNonEmptyString(site?.about?.headline, "about.headline");
  assertNonEmptyString(site?.about?.bio, "about.bio");
  if (!Array.isArray(site?.services) || site.services.length === 0) {
    throw new Error("services must be a non-empty array");
  }
  assertNonEmptyString(site?.process?.headline, "process.headline");
  if (!Array.isArray(site?.process?.steps) || site.process.steps.length === 0) {
    throw new Error("process.steps must be a non-empty array");
  }
  assertNonEmptyString(site?.contact?.headline, "contact.headline");
  assertNonEmptyString(site?.contact?.intro, "contact.intro");
  assertNonEmptyString(site?.contact?.email, "contact.email");
  assertNonEmptyString(site?.contact?.linkedin, "contact.linkedin");
  assertNonEmptyString(site?.contact?.linkedin_label, "contact.linkedin_label");
  assertNonEmptyString(site?.contact?.call_to_action, "contact.call_to_action");
  assertNonEmptyString(site?.footer?.copyright, "footer.copyright");

  const data = {
    ...site,
    about: {
      ...site.about,
      bio_paragraphs: splitParagraphs(site.about.bio),
    },
  };

  await emptyDir(distDir);
  await fs.mkdir(path.join(distDir, "assets"), { recursive: true });

  // Copy static assets
  await copyDir(assetsDir, path.join(distDir, "assets"));

  // Render templates
  const env = nunjucks.configure(templatesDir, {
    autoescape: true,
    noCache: true,
  });

  const pages = [
    {
      template: "index.njk",
      outFile: "index.html",
      page: {
        title: site.site?.title,
        description: site.site?.description,
      },
    },
    {
      template: "about.njk",
      outFile: "about.html",
      page: {
        title: site.ui?.sections?.about_title ?? "About",
        description: site.about?.headline ?? site.site?.description,
      },
    },
    {
      template: "services.njk",
      outFile: "services.html",
      page: {
        title: site.ui?.sections?.services_title ?? "Services",
        description: "AI training, strategy, and implementation support for mid-size teams.",
      },
    },
    {
      template: "process.njk",
      outFile: "process.html",
      page: {
        title: site.ui?.sections?.process_title ?? "Process",
        description: site.process?.headline ?? site.site?.description,
      },
    },
    {
      template: "contact.njk",
      outFile: "contact.html",
      page: {
        title: site.ui?.sections?.contact_title ?? "Contact",
        description: site.contact?.intro ?? site.site?.description,
      },
    },
  ];

  await Promise.all(
    pages.map(async ({ template, outFile, page }) => {
      const html = env.render(template, {
        ...data,
        page,
      });
      await fs.writeFile(path.join(distDir, outFile), html, "utf8");
    })
  );

  // Helpful for debugging deployments
  await fs.writeFile(
    path.join(distDir, "site.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(`Built ${path.relative(rootDir, distDir)}/`);
}

main().catch((err) => {
  console.error("Build failed:");
  console.error(err);
  process.exit(1);
});
