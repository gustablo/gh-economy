import { Server as ServerIO } from 'socket.io';
import http from 'http';
import { UserPrismaRepository } from './repositories/implementations/user-repository-prisma';
import { WalletPrismaRepository } from './repositories/implementations/wallet-repository-prisma';
import { BetRepositoryPrisma } from './repositories/implementations/bet-repository-prisma';
import { User } from './entities/user';
import { sleep } from './shared/utils/sleep';

export const socket = (server: http.Server) => {
    const io = new ServerIO(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userRepository = new UserPrismaRepository();
    const walletRepository = new WalletPrismaRepository();
    const betRepository = new BetRepositoryPrisma();

    io.on('connection', (socket) => {
        socket.on('user_connected', async (userId) => {
            await userRepository.update({ socketId: socket.id, status: "ONLINE" }, Number(userId));

            socket.on('disconnect', async (_) => {
                await userRepository.update({ status: "OFFLINE", socketId: '' }, Number(userId));
            });
        });


        socket.on('ask_bet', async (data) => {
            const bet = await betRepository.create({
                amount: Number(data.amount),
                challenged: new User({ id: '1' }),
                challenger: new User({ id: '1' }),
                game: 'HEADS_OR_TAILS',
            });

            io.to(data.challengedId).emit('received_bet_challenge', {
                amount: data.amount,
                game: data.game,
                challengerId: socket.id,
                challengerName: data.challengerName,
                betId: bet.id,
            });
        });

        socket.on('answer_challenge', async (data) => {
            if (data.answer === 'ACCEPT') {
                io.to([data.challengerId, socket.id]).emit('redirect_to_game', data.betId);

                io.to(socket.id).emit('make_choice', data.challengerId);
                io.to(data.challengerId).emit('enemy_making_choice');
                return;
            }

            io.to(data.challengerId).emit('denied_game');
        });

        socket.on('made_choice', async data => {
            io.to(data.challengerId).emit('enemy_made_choice', data.choice);

            io.to([socket.id, data.challengerId]).emit('start_game');

            const headsOrTails = Math.floor(Math.random() * 2);
            const winner = (data.choice == headsOrTails) ? socket.id : data.challengerId;
            const loser = (data.choice != headsOrTails) ? socket.id : data.challengerId;

            const bet = await betRepository.findBy({ id: data.betId });

            const userWinner = await userRepository.findBy({ socket_id: winner });
            const userLoser = await userRepository.findBy({ socket_id: loser });

            await sleep(2000);

            io.to([socket.id, data.challengerId]).emit('game_result', headsOrTails);

            userWinner?.wallet?.add(bet!.amount);
            userLoser?.wallet?.sub(bet!.amount);

            await walletRepository.update(userWinner?.wallet?.props.id!, userWinner?.wallet?.props.balance!);
            await walletRepository.update(userLoser?.wallet?.props.id!, userLoser?.wallet?.props.balance!);

            await sleep(5000);

            io.to(winner).emit('you_win');
            io.to(winner).emit('update_wallet', userWinner?.wallet?.props.balance);

            io.to(loser).emit('you_lose');
            io.to(loser).emit('update_wallet', userLoser?.wallet?.props.balance);
        });
    });

    return io;
}
