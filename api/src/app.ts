import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(routes);

export { server };
