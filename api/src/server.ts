import 'dotenv/config';
import { server } from './app';
import { socket } from './socket';

socket(server);

server.listen(process.env.PORT || 3333, () => {
    console.log('Api running');
});
