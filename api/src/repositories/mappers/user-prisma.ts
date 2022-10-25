import { item, user, user_items, wallet } from "@prisma/client"
import { User } from "../../entities/user"
import { BaseMapper } from "./base";
import { UserItemPrismaMapper } from "./user-item-prisma";
import { WalletPrismaMapper } from "./wallet-prisma";

export class UserPrismaMapper extends BaseMapper<User> {

    toModel(user: user & { wallet?: wallet, user_items?: (user_items & { item?: item})[] } | null): User {
        if (!user) return new User();

        return new User({
            id: user.id?.toString(),
            avatarUrl: user.avatar_url,
            name: user.name,
            role: user.role,
            socketId: user.socket_id,
            status: user.status,
            wallet: new WalletPrismaMapper().toModel(user.wallet!),
            userItems: new UserItemPrismaMapper().toModelCollection(user.user_items!),
        })
    }

}

