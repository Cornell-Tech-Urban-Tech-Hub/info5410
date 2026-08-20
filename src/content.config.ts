/**
 * Content collections for the INFO 5410 site.
 * The team collection mirrors the INFO 5420 site model and adds email.
 * The projects collection carries the CDspec project phases.
 * The readings collection carries course readings. The entry body is
 * the optional OCR-ed store of the original text. See wiki/readings.md.
 * The recommendedReadings collection carries the optional background
 * bibliography, held in one data file rather than one file per entry.
 * Pages map over these collections. They do not hardcode lists.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    email: z.string().email().optional(),
    mentors: z
      .array(
        z.object({
          name: z.string(),
          bio: z.string(),
        })
      )
      .optional(),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    due: z.string(),
    weight: z.string(),
    url: z.string().url().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

const readings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/readings' }),
  schema: z.object({
    title: z.string(),
    /** Link to the reading material. Optional until a real link exists.
     * Never invent a URL. Entries without one render as plain citations. */
    url: z.string().url().optional(),
    /** Files served by this site, relative to the site root without the
     * base path (e.g. "readings/files/example.pdf"). */
    files: z
      .array(
        z.object({
          label: z.string(),
          path: z.string(),
        })
      )
      .optional(),
    author: z.string().optional(),
    year: z.number().optional(),
    venue: z.string().optional(),
    /** Syllabus week the reading is assigned to. */
    week: z.number().optional(),
    /** Short note, e.g. chapters or pages to read. */
    note: z.string().optional(),
    order: z.number().optional(),
  }),
});

/**
 * Recommended reading: background titles, not assigned work. These are
 * plain citations, so they live in a single YAML file instead of one
 * markdown file each, and they carry no body and no week.
 */
const recommendedReadings = defineCollection({
  loader: file('src/content/recommended-readings.yaml'),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    /** Publisher or issuing organization, as supplied. */
    publisher: z.string().optional(),
    /** Place of publication, where the citation gives one. */
    place: z.string().optional(),
    year: z.number().optional(),
    /** Link to the title. Optional. Never invent a URL. */
    url: z.string().url().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { team, projects, readings, recommendedReadings };
