import express, { json, urlencoded } from 'express';
import fileUpload from 'express-fileupload';
import logger from 'morgan';
import router from './router.js';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(fileUpload({createParentPath: true}));
app.use('/api/v1', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send({
    message: 'Page not found'
  });
  next();
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
