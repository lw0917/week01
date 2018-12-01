var gulp=require('gulp');
var sass=require('gulp-sass');
var cleanCss=require('gulp-clean-css');
var server=require('gulp-webserver');
var fs=require('fs');
var path=require('path');
var url=require('url');
var uglify=require('gulp-uglify');
var babel=require('gulp-babel');

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
   gulp.task('dev',gulp.series('devSass','devServer','watch'));

   //线上环境

   //拷贝css
   gulp.task('bCss',function(){
        return gulp.src('./src/css/*.css')
               .pipe(gulp.dest('./bulid/css'))
   })
   //压缩js
   gulp.task('bUglify',function(){
         return gulp.src('./src/js/*js')
                .pipe(babel({
		        	presets: ['@babel/env']
	          	 }))
                .pipe(uglify())
                .pipe(gulp.dest('./bulid/js'))
   })
   //拷贝js
   gulp.task('bCopy',function(){
    return gulp.src('./src/js/libs/*js')
           .pipe(gulp.dest('./bulid/js/libs'))
   })
   //拷贝html
   gulp.task('bHtml',function(){
    return gulp.src('./src/*.html')
           .pipe(gulp.dest('./bulid'))
   })

   //线上
   gulp.task('bulid',gulp.parallel('bCss','bUglify','bCopy','bHtml'))