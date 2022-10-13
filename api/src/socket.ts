import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { UserPrismaRepository } from './repositories/implementations/user-repository-prisma';

export const socket = (server: http.Server) => {
    const io = new ServerIO(server, {
        cors: {
            origin: '*'
        }
    });

    const userRepository = new UserPrismaRepository();

    io.on('connection', (socket) => {
        socket.on('user_connected', async (userId) => {
            await userRepository.update({ socketId: socket.id, status: "ONLINE" }, Number(userId));

            socket.on('disconnect', async (_) => {
                await userRepository.update({ status: "OFFLINE", socketId: '' }, Number(userId));
            });
        });


        socket.on('ask_bet', (data) => {
            io.to(data.challengedId).emit('received_bet_challenge', {
                amount: data.amount,
                game: data.game,
                challengerId: socket.id,
            });
        });

        // bets
        // user_id1, user_id2, game, amount, winner_id, hour
        // /game/5

        socket.on('answer_challenge', (data) => {
            // data.answer // ACCEPT - DENY

            if (data.answer === 'ACCEPT') {
                // const bet = criarbet
                io.to([data.challengerId, socket.id]).emit('redirect_to_game', bet.id);
            } else {
                io.to(data.challengerId).emit('peidou');
            }

        });
    });
}
