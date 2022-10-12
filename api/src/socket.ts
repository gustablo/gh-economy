import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { UserPrismaRepository } from './repositories/implementations/user-repository-prisma';

export  const socket = (server:  http.Server) => {
    const io = new ServerIO(server);
    const userRepository = new UserPrismaRepository();
    
    io.on('connection', (socket) => {
        socket.on('connect', async (userId) => {
            await userRepository.update({ socketId: socket.id, status: "ONLINE" }, Number(userId));
            
            socket.on('disconnect', async (reason) => {
                await userRepository.update({ status: "OFFLINE" }, Number(userId));
            });
        });


        socket.on('ask_bet', (data) => {
            // io.to(data.challenged_socket_id).emit('received_bet_challenge', data);
        });

        socket.on('answer_challenge', (data) => {
            // data.answer // ACCEPT - DENY

            // if (accept) {
            //     socket.emit('join', 'nome_da_sala')
            //     io.to(data.chalelenger_id).emit('join', 'nome_da_sala')
            // }
        });

        socket.on('join', (nomeDaSala) => {
            socket.join(nomeDaSala);

            socket.emit('redirect_to_room', nomeDaSala);
        })

    });
}

// socket.on('received_bet_challenge')

// io.to().emit('answer_challenge', {
//     answer: 'ACCEPT',
//     challenged_id: 123,
//     challenger_id: 321,
// })

// socket.emit('ask_bet', {
//     bet: 'JOKENPO',
//     amount: 10.50,
//     challenged_id: 123 // socket_id do usuario desafiado,
// })


// migration - add status, add picture_url, socket_id
// get all all users online (endpoint)
