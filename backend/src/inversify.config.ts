import {Container} from "inversify";
import {UserService} from "./services/user.service";
import {TYPES} from "./types";
import {UserController} from "./controllers/user.controller";
import {UserRepository} from "./repositories/user.repository";

const container = new Container();

//controller
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
//service
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
//repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

export {container};
