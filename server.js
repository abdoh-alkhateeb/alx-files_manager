import express from 'express';
import indexRouter from './routes/index';

const port = process.env.PORT || 5000;
const app = express();

app.use('/', indexRouter);

app.listen(port);
