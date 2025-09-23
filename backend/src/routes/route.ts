import Router from "koa-router";
import {UserController} from "../controllers/user.controller";
import {TYPES} from "../types";
import {container} from '../inversify.config';
import {IdParamDto} from "../dtos/id-param.dto";
import {validateParams} from "../middleware/validate-params";

const router = new Router({prefix: '/users'});

const controllerUser = container.get<UserController>(TYPES.UserController);

router.get('/', ctx => controllerUser.findAll(ctx));
router.post('/', ctx => controllerUser.create(ctx));
router.patch('/:id', validateParams(IdParamDto), ctx => controllerUser.update(ctx));
router.delete('/:id', validateParams(IdParamDto), ctx => controllerUser.delete(ctx));

export default router;