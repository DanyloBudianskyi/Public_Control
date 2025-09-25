import {Container} from "inversify";
import {UserService} from "./services/user.service";
import {TYPES} from "./types";
import {UserController} from "./controllers/user.controller";
import {UserRepository} from "./repositories/user.repository";
import {ReportController} from "./controllers/report.controller";
import {ReportRepository} from "./repositories/report.repository";
import {ReportService} from "./services/report.service";

const container = new Container();

//controller
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
//service
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
//repository
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();


//controller
container.bind<ReportController>(TYPES.ReportController).to(ReportController).inSingletonScope();
//service
container.bind<ReportService>(TYPES.ReportService).to(ReportService).inSingletonScope();
//repository
container.bind<ReportRepository>(TYPES.ReportRepository).to(ReportRepository).inSingletonScope();

export {container};
