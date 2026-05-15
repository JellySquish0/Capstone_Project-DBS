import express from 'express';
import routes from './routes.js';

const app = express();

app.use(express.json());

app.use(routes);

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});