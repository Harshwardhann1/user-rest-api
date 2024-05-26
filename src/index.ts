import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import routes from './routes/index';

const app = express();
app.use(express.json());

createConnection()
  .then(() => {
    app.use('/api', routes);
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => console.log(error));
