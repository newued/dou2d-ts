var gulp = require("gulp");
var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify-es").default;

gulp.task("ts", function () {
  var tsProject = ts.createProject("tsconfig.json");
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest("bin"));
});

gulp.task("uglify", function () {
  return gulp.src("bin/dou2d.js")
    .pipe(uglify())
    .pipe(rename({ basename: "dou2d.min" }))
    .pipe(gulp.dest("bin"));
});

gulp.task("default", gulp.series("ts", "uglify"));
