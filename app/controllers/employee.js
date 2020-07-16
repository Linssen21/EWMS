const catchAsync = require("../utils/catchAsync");
const handleAsync = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const EmployeeTable = require("../models/employee/table");
const Employee = require("../models/employee/index");

const { saveCache } = require("../services/cache");

exports.getEmployee = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const [employee, employeeErr] = await handleAsync(
    EmployeeTable.getEmployee(id)
  );
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));

  res.status(200).json({ data: employee });
  await saveCache({
    key: req.accountId,
    hash: req.originalUrl,
    data: { data: employee },
  });
});

exports.getEmployees = catchAsync(async (req, res, next) => {
  const [employees, employeesErr] = await handleAsync(
    EmployeeTable.getEmployees({ opts: req.query })
  );
  if (employeesErr)
    return next(new AppError("There was an error in fetching the data", 400));

  res.status(200).json({ data: employees });
  await saveCache({
    key: req.accountId,
    hash: req.originalUrl,
    data: { data: employees },
  });
});

exports.storeEmployee = catchAsync(async (req, res, next) => {
  const { info, address } = req.body;

  const newEmployee = new Employee({ info, address });

  const [employees, employeeErr] = await handleAsync(
    EmployeeTable.storeEmployee({
      info: newEmployee.info,
      address: newEmployee.address,
    })
  );
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "Employee added succesfully" });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  const { info, address } = req.body;
  const id = req.params.id;

  const [employee, employeeErr] = await handleAsync(
    EmployeeTable.updateEmployee({
      info,
      address,
      id,
    })
  );
  if (employeeErr)
    return next(new AppError("There was an error in fetching the data", 400));
  res.status(200).json({ message: "Employee updated succesfully" });
});

exports.findNearestDetachment = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    EmployeeTable.findNearestDetachment({
      opts: req.query,
      id: req.params.id,
    })
  );
  if (detachmentErr || !detachment)
    return next(new AppError("There was an error in getting the data", 400));
  res.status(200).json({ detachment });
  await saveCache({
    key: req.accountId,
    hash: req.originalUrl,
    data: { detachment },
  });
});

exports.findNearestDetachmentGeo = catchAsync(async (req, res, next) => {
  const [detachment, detachmentErr] = await handleAsync(
    EmployeeTable.findNearestDetachmentGeo({
      opts: req.query,
      id: req.params.id,
    })
  );
  if (detachmentErr || !detachment)
    return next(new AppError("There was an error in getting the data", 400));
  res.status(200).json({ detachment });
  await saveCache({
    key: req.accountId,
    hash: req.originalUrl,
    data: { detachment },
  });
});