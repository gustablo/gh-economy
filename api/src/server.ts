import 'dotenv/config';
import { server } from './app';
import { socket } from './socket';

socket(server);

server.listen(process.env.PORT || 3335, () => {
    console.log('Api running');
});
