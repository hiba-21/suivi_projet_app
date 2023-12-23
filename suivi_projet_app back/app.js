const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const projetRouter = require('./routes/projetRoutes');
const taskRouter = require('./routes/taskRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();
const cors = require('cors');
app.set('view engine','pug');

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.options('*', cors());
// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());



// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
 // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/',viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projets', projetRouter);
app.use('/api/v1/tasks', taskRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});



module.exports = app;
