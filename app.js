const path = require('path');
const express = require('express');
const userRoute = require('./Router/userRoutes');
const taskRoutes = require('./Router/taskRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true, limit:'10kb'}));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tasks', taskRoutes);


app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);


module.exports = app;