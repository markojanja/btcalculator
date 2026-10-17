import { Prisma } from "@prisma/client";

// Maps Prisma errors that are caused by the request to client errors.
const PRISMA_ERRORS = {
  P2002: { status: 409, text: "A record with these details already exists." },
  P2003: { status: 400, text: "A related record does not exist." },
  P2025: { status: 404, text: "Record not found." },
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  let text = err.message || "Internal server error";

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    PRISMA_ERRORS[err.code]
  ) {
    ({ status: statusCode, text } = PRISMA_ERRORS[err.code]);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    text = "Invalid request.";
  }

  if (statusCode >= 500) {
    console.error(err);
    // Internal details stay in the logs, not in production responses.
    if (process.env.NODE_ENV === "production") {
      text = "Internal server error";
    }
  }

  return res.status(statusCode).json({
    title: "error",
    statusCode,
    message: {
      text,
    },
  });
};

export default errorHandler;
