const errorHandler = (err, req, res, next) => {
  const title = "error";
  const statusCode = err.status || 500;
  const message = err.message || "Internal server error";

  return res
    .status(statusCode)
    .json("error", { title, statusCode, message: { text: message } });
};

export default errorHandler;
