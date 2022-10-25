import { User, UserProps } from "../../entities/user";
import { UserPrismaMapper } from "../mappers/user-prisma";
import { UserRepository } from "../user-repository";
import { prisma } from "./prisma";

export class UserPrismaRepository implements UserRepository {
  private mapper = new UserPrismaMapper();

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

    const { props } = this.mapper.toModel(created);

    return props;
  }

  async findBy(conditions: any): Promise<UserProps | null> {
    const { name, id, role, wallet_id, password, socket_id } = conditions;

    const user = await prisma.user.findFirst({
      include: {
        wallet: true,
        user_items: {
          include: {
            item: true,
          }
        },
      },
      where: {
        name,
        id: id ? Number(id) : undefined,
        role,
        wallet_id: wallet_id ? Number(wallet_id) : undefined,
        password,
        socket_id,
      },
    });

    if (!user) return null;

    const { props } = this.mapper.toModel(user);

    return props;
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

  async listOnline(userId: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        status: 'ONLINE',
        id: {
          not: userId,
        }
      }
    });

    const mapped = this.mapper.toModelCollection(users);

    return mapped;
  }

  async listRiches(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        user_items: {
          include: {
            item: true,
          },
        },
        wallet: true,
      },
      orderBy: {
        wallet: {
          balance: 'desc'
        }
      },
      where: {
        role: {
          not: 'GOVERNMENT'
        }
      }
    });

    return this.mapper.toModelCollection(users);
  }
}
