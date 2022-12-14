import 'dotenv/config';
import { app } from './app';
import { socket } from './socket';
import http from 'http';

const server = http.createServer(app);
const io = socket(server);

app.set('io', io);

server.listen(process.env.PORT || 3009, () => {
    console.log('Api running');
});
