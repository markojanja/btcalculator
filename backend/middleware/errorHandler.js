const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    title: "error",
    statusCode,
    message: {
      text: err.message || "Internal server error",
    },
  });
};

export default errorHandler;
