var gulp=require('gulp');
var sass=require('gulp-sass');
var cleanCss=require('gulp-clean-css');
var server=require('gulp-webserver');
var fs=require('fs');
var path=require('path');
var url=require('url');


   //编译scss
   gulp.task('devSass',function(){
        return gulp.src('./src/sass/*.scss')
               .pipe(sass())
               .pipe(cleanCss())
               .pipe(gulp.dest('./src/css'))
   })
   //监听
   gulp.task('watch',function(){
        return gulp.watch('./src/sass/*.scss',gulp.series('devSass'));
   })

    //起服务
    gulp.task('devServer',function(){
          return gulp.src('src')
                 .pipe(server({
                     port:1111,
                     middleware:function(req,res,next){
                         var pathname=url.parse(req.url).pathname;
                         if(pathname==='/favicon.ico'||pathname==='/swiper.min.js.map'){
                              return res.end()
                         }
                         pathname=pathname==='/'?'index.html':pathname;
                         res.end(fs.readFileSync(path.join(__dirname,'src',pathname)));
                     }
                 }))
                   
    })

   //开发环境
   gulp.task('dev',gulp.series('devSass','watch'));