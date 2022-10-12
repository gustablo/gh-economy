import { Server as ServerIO } from 'socket.io';
import http from 'http';

export  const socket = (server:  http.Server) => {
    const io = new ServerIO(server);
    
    io.on('connection', (socket) => {

        socket.on('connect', (userId) => {
            // atualiza no banco - status online, socket_id
        });

        socket.on('disconnect', (userId) => {
            // ... atualiza no banco - status offline, socket_id
        });

        socket.on('ask_bet', (data) => {
            // const user = userRepository.findBy({ user_id: data.challenged_id });
            io.to(user.socket_id).emit('received_bet_challenge', data);
        });

        socket.on('answer_challenge', (data) => {
            // data.answer // ACCEPT - DENY

            if (accept) {
                socket.join('nome_da_sala');
                io.to(challenger).emit('join', 'nome_da_sala')
            }
        });

        socket.on('join', (nomeDaSala) => {
            socket.join(nomeDaSala);
        })

    });
}

socket.on('received_bet_challenge')

io.to().emit('answer_challenge', {
    answer: 'ACCEPT',
    challenged_id: 123,
    challenger_id: 321,
})

socket.emit('ask_bet', {
    bet: 'JOKENPO',
    amount: 10.50,
    challenged_id: 123 // id do usuario desafiado,
    challenger_id: 321 // id do usuraio desafiador,
})


// migration - add status, add picture_url, socket_id
// get all all users online (endpoint)
