import 'dotenv/config';
import { server } from './app';
import { socket } from './socket';

socket(server);

server.listen(process.env.PORT || 9784, () => {
    console.log('Api running');
});

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT');
});