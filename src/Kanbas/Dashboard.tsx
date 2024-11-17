import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleEnrollment } from "./enrollmentReducer";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

export default function Dashboard({
  courses,
  enrolledCourses,
  setEnrolledCourses,
  course,
  setCourse,
  setCourses,
  deleteCourse,
}: {
  courses: any[];
  enrolledCourses: any[];
  setEnrolledCourses: (courses: any[]) => void;
  course: any;
  setCourse: (course: any) => void;
  setCourses: (courses: any[]) => void;
  deleteCourse: (course: any) => void;
}) {
  const navigate = useNavigate();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [filteredCourses, setFilteredCourses] =
    useState<any[]>(enrolledCourses);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const showFilteredCourses = () => {
    showAllCourses
      ? setFilteredCourses(enrolledCourses)
      : setFilteredCourses(courses);
    setShowAllCourses(!showAllCourses);
  };

  const isStudent = currentUser.role === "STUDENT";

  const handleEnrollmentToggle = async (courseId: string) => {
    if (enrolledCourses.some((c) => c._id === courseId)) {
      await userClient
        .unenrollUserFromCourse(currentUser._id, courseId)
        .then(userClient.findMyCourses)
        .then(setEnrolledCourses);
    } else {
      await userClient
        .enrollUserInCourse(currentUser._id, courseId)
        .then(userClient.findMyCourses)
        .then(setEnrolledCourses);
    }
  };

  const handleCourseNavigation = (
    e: React.MouseEvent,
    courseId: string,
    to: string
  ) => {
    e.preventDefault();
    if (!isStudent || filteredCourses.some((c) => c._id === courseId)) {
      navigate(to);
    } else {
      alert("You must be enrolled in this course to view its content.");
    }
  };

  const updateCourse = async () => {
    const update = await courseClient.updateCourse(course);

    if (update) {
      enrolledCourses.find((c) => c._id === course._id).name = update.name;
      enrolledCourses.find((c) => c._id === course._id).description =
        update.description;

      setCourse(enrolledCourses.find((c) => c._id === course._id));
    }
  };

  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([...courses, { ...course, newCourse }]);
  };

  const CourseGrid = ({ course }: { course: any }) => {
    const c = course;
    return (
      <div key={c._id} className="col" style={{ width: "300px" }}>
        <div className="card h-100">
          <div
            className="card-img-top"
            style={{
              height: "160px",
              backgroundImage: "url('/images/reactjs.jpg')",
              backgroundSize: "cover",
            }}
          />
          <div className="card-body">
            <h5 className="card-title">{c.name}</h5>
            <p
              className="card-text overflow-hidden"
              style={{ height: "100px" }}
            >
              {c.description}
            </p>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-primary"
                onClick={(e) =>
                  handleCourseNavigation(
                    e,
                    c._id,
                    `/Kanbas/Courses/${c._id}/Home`
                  )
                }
              >
                View Course
              </button>

              {isStudent && (
                <>
                  {!enrolledCourses.some((e) => e._id === c._id) &&
                    showAllCourses && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleEnrollmentToggle(c._id)}
                      >
                        Enroll
                      </button>
                    )}
                  {enrolledCourses.some((e) => e._id === c._id) && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEnrollmentToggle(c._id)}
                    >
                      Unenroll
                    </button>
                  )}
                </>
              )}

              {currentUser.role === "FACULTY" && (
                <div>
                  <button
                    onClick={() => setCourse(c)}
                    className="btn btn-warning me-2 float-end"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="btn btn-danger float-end"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {isStudent && (
          <button className="btn btn-primary" onClick={showFilteredCourses}>
            {showAllCourses ? "Show My Enrollments" : "Show All Courses"}
          </button>
        )}
      </div>
      <hr />

      {currentUser.role === "FACULTY" && (
        <>
          <h5>
            This is the faculty dashboard. New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              {" "}
              Add{" "}
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control"
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      {/* Course List Section */}
      <h2>
        {showAllCourses
          ? "All Available Courses"
          : `${isStudent ? "My Enrolled" : "Published"} Courses`}{" "}
        ({showAllCourses ? courses.length : enrolledCourses.length})
      </h2>
      <hr />

      <div className="row row-cols-1 row-cols-md-5 g-4">
        {showAllCourses
          ? courses.map((c) => <CourseGrid key={c._id} course={c} />)
          : enrolledCourses.map((c) => <CourseGrid key={c._id} course={c} />)}
      </div>
    </div>
  );
}
