import 'dotenv/config';
import { app } from './app';
import { socket } from './socket';
import http from 'http';

const server = http.createServer(app);
const io = socket(server);

app.set('io', io);

server.listen(process.env.PORT || 1040, () => {
    console.log('Api running');
});

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT');
});
