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
        console.log('connected');
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
                challengerName: data.challengerName,
            });
        });

        // bet
        // user_id1(challenger_id), user_id2 (challenged_id), game, amount
        // /game/5

        // bet_games
        // bet_id winner_id, double, amount

        socket.on('answer_challenge', (data) => {
            if (data.answer === 'ACCEPT') {
                // const bet = criarbet
                io.to([data.challengerId, socket.id]).emit('redirect_to_game', 1);
                
                io.to(socket.id).emit('make_choice', data.challengerId);
                io.to(data.challengerId).emit('enemy_making_choice');
                return;
            }

            io.to(data.challengerId).emit('denied_game');
        });

        socket.on('made_choice', data => {
            io.to(data.challengerId).emit('enemy_made_choice', data.choice);

            io.to([socket.id, data.challengerId]).emit('start_game');

            setTimeout(() => {
                const headsOrTails = Math.floor(Math.random() * 2);
                const winner = (data.choice == headsOrTails) ? socket.id : data.challengerId;
                const loser = (data.choice != headsOrTails) ? socket.id : data.challengerId;

                io.to([socket.id, data.challengerId]).emit('game_result', headsOrTails);

                setTimeout(() => {
                    io.to(winner).emit('you_win');
                    io.to(loser).emit('you_lose');
                }, 5000);
            }, 5000);
        });
    });
}
