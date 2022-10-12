import { Item } from "../../entities/item";
import { UserProps } from "../../entities/user";
import { UserItem } from "../../entities/user-item";
import { Wallet } from "../../entities/wallet";
import { UserRepository } from "../user-repository";
import { prisma } from "./prisma";

export class UserPrismaRepository implements UserRepository {
  async create(
    user: Omit<UserProps, "wallet">,
    walletId: string
  ): Promise<UserProps> {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        password: user.password,
        wallet_id: Number(walletId),
        role: user.role.toString(),
      },
    });

    return {
      id: created.id.toString(),
      name: created.name,
      role: created.role,
      password: created.password,
      wallet: undefined,
    };
  }

  async findBy(conditions: any): Promise<UserProps | null> {
    const { name, id, role, wallet_id, password } = conditions;

    const user = await prisma.user.findFirst({
      include: {
        wallet: true,
        user_items: true,
      },
      where: {
        name,
        id: id ? Number(id) : undefined,
        role,
        wallet_id: wallet_id ? Number(wallet_id) : undefined,
        password,
      },
    });

    if (!user) return null;

    return {
      id: user.id.toString(),
      name: user.name,
      role: user.role,
      password: user.password,
      wallet: new Wallet({
        id: user.wallet?.id?.toString(),
        balance: parseFloat(user.wallet?.balance?.toString()),
      }),
      userItems: user.user_items.map((userItem) => {
        return new UserItem({
          quantity: userItem.quantity,
          buyedPer: Number(userItem.buyed_per),
        });
      }),
    };
  }

  async update(user: Partial<UserProps>, userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        socket_id: user.socketId,
        status: user.status,
      },
    });
  }

  async updateBySocketId(user: Partial<UserProps>, socketId: string): Promise<void> {
    await prisma.user.updateMany({
      where: { socket_id: socketId },
      data: {
        status: user.status,
      },
    });
  }
}
