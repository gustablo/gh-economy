import { User } from "../entities/user";
import { UserPrismaRepository } from "../repositories/implementations/user-repository-prisma";
import { WalletPrismaRepository } from "../repositories/implementations/wallet-repository-prisma";
import { HttpResponse } from "../shared/contracts/http-response";
import { commonError, commonSuccess } from "../shared/utils/http-returns";
import { Signin } from "../usecases/sigin";
import { Signup } from "../usecases/signup";
import { SignupRequestDTO } from "../dtos/signup";
import { SigninRequestDTO } from "../dtos/signin";
import { CurrentUser } from "../usecases/current-user";
import { OnlineUsers } from "../usecases/online-users";

export class UserController {

    private userRepo = new UserPrismaRepository();
    private siginUseCase = new Signin(this.userRepo);
    private currentUseCase = new CurrentUser(this.userRepo);
    private onlineUseCase = new OnlineUsers(this.userRepo);
    private signupUseCase = new Signup(
        this.userRepo,
        new WalletPrismaRepository(),
    );


    async sigup(body: SignupRequestDTO): Promise<HttpResponse> {
        try {
            const response = await this.signupUseCase.exec(body);

            return commonSuccess(response);
        } catch (err) {
            return commonError(err as Error);
        }
    }

    async sigin(body: SigninRequestDTO): Promise<HttpResponse> {
        try {
            const response = await this.siginUseCase.exec(body.name, body.password);

            return commonSuccess(response);
        } catch (err) {
            return commonError(err as Error);
        }
    }

    async current(token: string): Promise<HttpResponse> {
        try {
            const result = await this.currentUseCase.exec(token);

            return commonSuccess(result);
        } catch (err) {
            return commonError(err as Error);
        }
    }

    async listOnline(token: string) {
        try {
            const result = await this.onlineUseCase.exec(token);

            return commonSuccess(result);
        } catch (err) {
            return commonError(err as Error);
        }
    }
}
