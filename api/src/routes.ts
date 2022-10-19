import { Response, Router } from 'express';
import { AnnouncementController } from './controllers/announcement';
import { BetController } from './controllers/bet';
import { ItemController } from './controllers/item';
import { TradeController } from './controllers/trade';
import { UserController } from './controllers/user';
import { isAuthorized } from './middlewares';
import { prisma } from './repositories/implementations/prisma';
import { HttpResponse } from './shared/contracts/http-response';

const routes = Router();

const userController = new UserController();
const tradeController = new TradeController();
const announcementController = new AnnouncementController();
const itemController = new ItemController();
const betController = new BetController();

routes.post('/sign-up', async (req, res) => {
    const result = await userController.sigup(req.body);

    return respond(result, res);
})

routes.post('/sign-in', async (req, res) => {
    const result = await userController.sigin(req.body);

    return respond(result, res);
});

routes.get('/current', isAuthorized, async (req, res) => {
    const result = await userController.current(req.headers['authorization']!);

    return respond(result, res);
});

routes.post('/trades/ask', isAuthorized, async (req, res) => {
    const result = await tradeController.askTrade(req.body, req.headers['authorization']!);

    return respond(result, res);
});

routes.post('/trades/confirm', isAuthorized, async (req, res) => {
    const result = await tradeController.confirmTrade(req.body, req.headers['authorization']!, req.app.get('io'));

    return respond(result, res);
});

routes.get('/trades/pending', isAuthorized, async (req, res) => {
    const result = await tradeController.pendingTrades(req.headers['authorization']!, req.query as any);

    return respond(result, res);
});

routes.post('/announcements', isAuthorized, async (req, res) => {
    const result = await announcementController.create(req.body, req.headers['authorization']!);

    return respond(result, res);
});

routes.delete('/announcements/:id', isAuthorized, async (req, res) => {
    const result = await announcementController.cancel(req.params['id'], req.headers['authorization']!);

    return respond(result, res);
});

routes.get('/items/announcements', async (req, res) => {
    const result = await itemController.listAnnouncedItems(req.headers['authorization']);

    return respond(result, res);
});

routes.get('/items/me', isAuthorized, async (req, res) => {
    const result = await itemController.listMyItems(req.headers['authorization']!);

    return respond(result, res);
});

routes.get('/items/:id/announcements', async (req, res) => {
    const result = await itemController.getItem(req.params['id']);

    return respond(result, res);
});

routes.post('/bets', isAuthorized, async (req, res) => {
    const result = await betController.makeBet(req.body, req.headers['authorization']!);

    return respond(result, res);
});

routes.get('/users/online', isAuthorized, async (req, res) => {
    const result = await userController.listOnline(req.headers['authorization']!);

    return respond(result, res);
})

routes.post('/daily-yields', async (_, res) => {
    const allUsers = await prisma.user.findMany({
        include: {
            user_items: {
                include: {
                    item: true,
                },
                where: {
                    quantity: {
                        gt: 0,
                    }
                }
            },
            wallet: true,
        }
    });

    for (const user of allUsers) {
        const items = user.user_items.map(userItem => userItem.item);

        const allYields = items.reduce((acc, item) => {
            acc += Number(item.yield);
            return acc;
        }, 0);

        await prisma.wallet.update({
            where: {
                id: user.wallet.id,
            },
            data: {
                balance: Number(user.wallet.balance) + Number(allYields),
            }
        });
    }

    return res.json({ ok: true }).status(200);
});

const respond = (result: HttpResponse, res: Response) => {
    return res.
        status(result.status)
        .send(result.message);
}

export { routes };
