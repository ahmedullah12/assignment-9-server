import catchAsync from "../../shared/catchAsync";

export const parseBody = catchAsync(async (req, res, next) => {
  if (!req.body.data) {
    throw new Error("Please provide data in the body under data key");
  }

  req.body = JSON.parse(req.body.data);

  next();
});
