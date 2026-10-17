import { z } from "zod";

// Enums mirror prisma/schema.prisma.
const Role = z.enum(["ADMIN", "MANAGER", "SUPPORT"]);
const Status = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CS_TICKET",
  "IT_TICKET",
]);
const Priority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const ClientStatus = z.enum(["ONBOARDING", "ACTIVE", "SUSPENDED", "INACTIVE"]);
const Platform = z.enum([
  "MT4",
  "MT5",
  "MT4SA",
  "MT5SA",
  "MTT",
  "cTrader",
  "ARK",
]);
const Server = z.enum(["live1", "live2", "live5", "live7"]);

const id = z.string().uuid();
const title = z.string().trim().min(1, "is required").max(200);
const name = z.string().trim().min(1, "is required").max(100);
// bcrypt only uses the first 72 bytes of a password.
const password = z.string().min(8, "must be at least 8 characters").max(72);

// Forms send "" or null for "no client"; both clear the relation.
const clientId = z
  .union([id, z.literal(""), z.null()])
  .optional()
  .transform((value) => (value === "" ? null : value));

// ---------- auth & users

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "is required"),
  newPassword: password,
});

const userFields = {
  firstname: name,
  lastname: name,
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().email(),
  role: Role.default("SUPPORT"),
  active: z.boolean().default(true),
  centroid: z.boolean().default(false),
};

export const createUserSchema = z.object({ ...userFields, password });

export const updateUserSchema = z
  .object({
    ...userFields,
    role: Role,
    active: z.boolean(),
    centroid: z.boolean(),
  })
  .partial();

// ---------- tasks & comments

export const createTaskSchema = z.object({
  title,
  description: z.string().default(""),
  status: Status.default("TODO"),
  priority: Priority.default("LOW"),
  client: clientId,
});

export const updateTaskSchema = z.object({
  id,
  title: title.optional(),
  description: z.string().optional(),
  status: Status.optional(),
  priority: Priority.optional(),
  userId: id.optional(),
  client: clientId,
});

export const commentSchema = z.object({
  description: z.string().trim().min(1, "is required").max(20000),
});

export const adminTasksParamsSchema = z.object({
  type: z.enum([
    "pending",
    "JIRA_TICKET",
    "priority",
    "ALL",
    ...Status.options,
  ]),
});

// ---------- clients

export const clientSchema = z.object({
  name,
  status: ClientStatus.default("ACTIVE"),
  server: Server,
  platform: z.array(Platform).default([]),
});

// ---------- features & guides

// An empty date input arrives as "" or null; treat both as "not provided"
// instead of letting coercion turn null into 1970-01-01.
const emptyToUndefined = (value) =>
  value === "" || value === null ? undefined : value;

const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

const requiredDate = z.preprocess(
  emptyToUndefined,
  z.coerce.date({ errorMap: () => ({ message: "is required" }) }),
);

export const createFeatureSchema = z.object({
  title,
  description: z.string().default(""),
  releaseDate: requiredDate,
  released: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const updateFeatureSchema = z.object({
  title: title.optional(),
  description: z.string().optional(),
  releaseDate: optionalDate,
  released: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const guideSchema = z.object({
  title,
  description: z.string().default(""),
  published: z.boolean().default(false),
});
