module.exports = (err, req, res, next) => {
  console.error("ERROR 💥", err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.status = "fail";
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).send({
    status,
    message: err.message || "Something went wrong",
  });
};
