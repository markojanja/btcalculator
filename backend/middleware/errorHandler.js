const errorHandler = (err, req, res, next) => {
  // multer errors (file too large, too many files) are the client's fault
  const statusCode = err.status || (err.name === "MulterError" ? 400 : 500);

  return res.status(statusCode).json({
    title: "error",
    statusCode,
    message: {
      text: err.message || "Internal server error",
    },
  });
};

export default errorHandler;
