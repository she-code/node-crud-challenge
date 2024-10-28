// const AppError = require("../utils/appError");

// const handleInvalidId = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
// };
// const sendErrorDev = (err, req, res) => {
//   //add api
//   // A) API
//   if (req.originalUrl.startsWith("/")) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack,
//     });
//   }
//   // B) RENDERED WEBSITE
//   console.error("ERROR ", err);
//   return res.status(err.statusCode).json({
//     title: "Something went wrong!",
//     msg: err.message,
//   });
// };
// const sendErrorProd = (err, req, res) => {
//   // A) API
//   if (req.originalUrl.startsWith("/")) {
//     // A) Operational, trusted error: send message to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     }
//     // B) Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error("ERROR ", err);
//     // 2) Send generic message
//     return res.status(500).json({
//       status: "error",
//       message: "Something went  wrong!",
//     });
//   }

//   // B) RENDERED WEBSITE
//   // A) Operational, trusted error: send message to client
//   if (err.isOperational) {
//     return res.status(err.statusCode).json({
//       title: "Something went wrong!",
//       msg: err.message,
//     });
//   }
//   // B) Programming or other unknown error: don't leak error details
//   // 1) Log error
//   console.error("ERROR ", err);
//   // 2) Send generic message
//   return res.status(err.statusCode).json({
//     title: "Something went wrong!",
//     msg: "Please try again later.",
//   });
// };
// module.exports = (err, req, res, next) => {
//   // console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, req, res);
//   } else if (process.env.NODE_ENV === "production") {
//     let error = { ...err };
//     error.message = err.message;

//     sendErrorProd(error, req, res);
//   }
// };

const AppError = require("../utils/appError");

const handleInvalidId = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error("ERROR ", err);
  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error("ERROR ", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  // B) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  console.error("ERROR ", err);
  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    sendErrorProd(error, req, res);
  }
};
