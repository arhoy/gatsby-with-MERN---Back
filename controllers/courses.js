const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
// type :  GET
// route:  api/v1/courses
// route : api/v1/bootcamps/:bootcampId/courses
// desc:   Get all the courses
// access: Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  const courses = await query;
  res.status(200).json({
    success: true,
    items: courses.length,
    data: courses,
  });
});

// type :  GET
// route:  api/v1/courses/:id
// desc:   Get a course by id
// access: Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    items: course.length,
    data: course,
  });
});

// type :  POST
// route : api/v1/bootcamps/:bootcampId/courses
// desc:   Create a course for a bootcamp
// access: PRIVATE
exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with id of ${req.params.bootcampId}`, 404),
    );
  }

  // insert the bootcampId into the course
  req.body.bootcamp = req.params.bootcampId;

  // create course
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    items: course.length,
    data: course,
  });
});

// type :  PUT
// route : api/v1/courses/:id
// desc:   Update a course by course id
// access: PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id} found`, 404),
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    items: course.length,
    data: course,
  });
});

// type :  DELETE
// route : api/v1/courses/:id
// desc:   Delete a course by course id
// access: PRIVATE
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id} found`, 404),
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    msg: 'Course was deleted',
  });
});
