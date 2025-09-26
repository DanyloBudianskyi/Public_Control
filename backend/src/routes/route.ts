import Router from "koa-router";
import {UserController} from "../controllers/user.controller";
import {TYPES} from "../types";
import {container} from '../inversify.config';
import {IdParamDto} from "../dtos/id-param.dto";
import {validateParams} from "../middleware/validate-params";
import {ReportController} from "../controllers/report.controller";

const router = new Router();

const controllerUser = container.get<UserController>(TYPES.UserController);
const controllerReport = container.get<ReportController>(TYPES.ReportController);

router.get('/users', ctx => controllerUser.findAll(ctx));
router.post('/users', ctx => controllerUser.create(ctx));
router.patch('/users/:id', validateParams(IdParamDto), ctx => controllerUser.update(ctx));
router.delete('/users/:id', validateParams(IdParamDto), ctx => controllerUser.delete(ctx));

router.get('/reports', ctx => controllerReport.findAll(ctx));
router.get('/reports/:id', validateParams(IdParamDto), ctx => controllerReport.findOne(ctx));
router.get('/reports/user/:userId', validateParams(IdParamDto), ctx => controllerReport.findByUser(ctx));
router.get('/reports/date/:date', ctx => controllerReport.findByDate(ctx));
router.post('/reports', ctx => controllerReport.create(ctx));
router.patch('/reports/:id', validateParams(IdParamDto), ctx => controllerReport.update(ctx));
router.delete('/reports/:id', validateParams(IdParamDto), ctx => controllerReport.delete(ctx));

export default router;