var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');
var program = require('commander');
var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////
//MONGOLAB////
//DATABASE////
/////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://kevinnam:ultimate@ds041603.mongolab.com:41603/template');
module.exports = mongoose.connection;
var Schema = mongoose.Schema;

/////////////////
//CONTENT ONE///
//API///////////
///////////////

var contentOneSchema = new Schema({
  code: String,
  title: String,
  subtitle1: String,
  subtitle2: String,
  content1: String,
  content2:String,
  image1: String,
  image2: String,
});

var content1 = mongoose.model('content1', contentOneSchema);

//GET
app.get('/api/content1', function(req,res,next){
  content1.find(function(err,content1){
    //console.log(content1);
    if(err){ return next(err)}
    res.json(content1);
  })
});

//UPDATE
app.post('/api/update/content1/:string', function(req,res,next){
  var toUpdate = req.params.string;
  
  if(toUpdate == 'title'){
   // console.log('Updating ' + toUpdate + ' ---> ' + req.body.title);
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.title = req.body.title;
      doc.save();
    });      
  } else if (toUpdate == 'subtitle1'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.subtitle1 = req.body.subtitle1;
      doc.save();
    });   
  } else if (toUpdate == 'subtitle2'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.subtitle2 = req.body.subtitle2;
      doc.save();
    });   
  } else if (toUpdate == 'content1'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.content1 = req.body.content1;
      doc.save();
    });   
  } else if (toUpdate == 'content2'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.content2 = req.body.content2;
      doc.save();
    });   
  } else if (toUpdate == 'image1'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.image1 = req.body.image1;
      doc.save();
    });   
  } else if (toUpdate == 'image2'){
    content1.findOne({ code: 'first' }, function (err, doc){
      doc.image2 = req.body.image2;
      doc.save();
    });   
  } else {
    console.log('Something went wrong');
  }

  res.redirect('/cms');

});

/////////////////
//CONTENT TWO///
//API///////////
///////////////

var content2Schema = new Schema({
  code: String,
  title: String,
  subtitle: String,
  content: String,
  image: String,
});

var content2 = mongoose.model('content2', content2Schema);

//GET
app.get('/api/content2', function(req,res,next){
  content2.find(function(err,content2){
    if(err){ return next(err)}
    res.json(content2);
  })
});

//UPDATE
app.post('/api/update/content2/:string', function(req,res,next){
  var toUpdate = req.params.string;
  
  if(toUpdate == 'title'){
   // console.log('Updating ' + toUpdate + ' ---> ' + req.body.title);
    content2.findOne({ code: 'second' }, function (err, doc){
      doc.title = req.body.title;
      doc.save();
    });      
  } else if (toUpdate == 'subtitle1'){
    content2.findOne({ code: 'second' }, function (err, doc){
      doc.subtitle = req.body.subtitle;
      doc.save();
    });   
  } else if (toUpdate == 'content1'){
    content2.findOne({ code: 'second' }, function (err, doc){
      doc.content = req.body.content;
      doc.save();
    });     
  } else if (toUpdate == 'image1'){
    content2.findOne({ code: 'second' }, function (err, doc){
      doc.image = req.body.image;
      doc.save();
    });     
  } else {
    console.log('Something went wrong');
  }

  res.redirect('/cms');

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////
//Directory/////
//File Manager//
////////////////

var dir =  process.cwd();
console.log(dir);

app.use(express.static(dir)); //current working directory
app.use(express.static(__dirname)); //module directory

app.get('/files', function(req, res) {
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 console.log("browsing ", currentDir);
 fs.readdir(currentDir, function (err, files) {
     if (err) {
        throw err;
      }
      var data = [];
      files
      .filter(function (file) {
          return true;
      }).forEach(function (file) {
        try {
                //console.log("processing ", file);
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (isDirectory) {
                  data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
                } else {
                  var ext = path.extname(file);
                  if(program.exclude && _.contains(program.exclude, ext)) {
                    console.log("excluding file ", file);
                    return;
                  }       
                  data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                }

        } catch(e) {
          console.log(e); 
        }        
        
      });
      data = _.sortBy(data, function(f) { return f.Name });
      res.json(data);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////

////////////////
//MULTER////////
//FILEUPLOADER//
////////////////

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = year + "-" + month + "-" + day;

    cb(null, newdate + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage });

app.post('/api/upload', upload.array('fileupload'), function (req, res, next) {
  console.log('Uploading file...');
  console.log(req.body);
  console.log(req.file);
  res.redirect('/cms');
})

app.post('/api/upload/image/:number/:string', upload.single('fileupload'), function (req,res,next){
  var number = req.params.number;
  var string = req.params.string;
  var path = "" + req.file.destination + req.file.filename;
  var content = ""

  console.log(req.file.destination);
  console.log(req.file.filename);
  console.log(path);

  if(number == "1"){
    content = content1;
  } else if (number == "2"){
    content = content2;
  } else if (number == "3"){
    content = content3;
  } else if (number == "4"){
    content = content4;
  } else if (number == "front"){
    content = contentfront;
  }

  content.findOne({ code: number }, function (err, doc){
    doc[string] = path;
    doc.save();
  });     

  console.log('Updating image...');
  console.log(req.body);
  console.log(req.file);
  res.redirect('/cms')


})


//////////////////////////////////////////////////////////////////////////////////////////////////


///////////////
//REMOVE FILE//
//FILE DELETE//
///////////////

app.post('/api/filedeletion/:filename', function(req,res,next){
  var filepath = './public/uploads/' + req.params.filename;
  console.log('Deleting file (' + filepath + ')... ' );
  fs.unlinkSync(filepath);
})


//////////////////////////////////////////////////////////////////////////////////////////////////

///////////
//ROUTING//
///////////
app.route('/cms')
  .get(function(req,res){
    res.render('cms');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
