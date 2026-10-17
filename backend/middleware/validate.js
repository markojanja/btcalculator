// Parses req[source] with a zod schema. Unknown fields are stripped and
// defaults applied, so controllers only ever see validated data.
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      const [first] = errors;

      return res.status(400).json({
        message: first.field
          ? `${first.field}: ${first.message}`
          : first.message,
        errors,
      });
    }

    req[source] = result.data;
    next();
  };
