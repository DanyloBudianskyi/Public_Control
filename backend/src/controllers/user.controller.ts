import {Context} from "koa";
import {plainToInstance} from "class-transformer";
import {CreateUserDto, LoginUserDto, UpdateUserDto} from "../dtos/user.dto";
import {validate} from "class-validator";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserService} from "../services/user.service";
import {formatValidationErrors} from "../errors/format";
import {ValidationError} from "../errors/app-err";

@injectable()
export class UserController {

    constructor(
        @inject(TYPES.UserService) private userService: UserService
    ) {
    }

    async create(ctx: Context) {
        const dto = plainToInstance(CreateUserDto, ctx.request.body);
        const errors = await validate(dto);
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.userService.create(dto);
        ctx.status = 201;
    }

    async login(ctx: Context) {
        const dto = plainToInstance(LoginUserDto, ctx.request.body)
        const errors = await validate(dto);
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.userService.login(dto.email, dto.password)
    }

    async findAll(ctx: Context) {
        ctx.body = await this.userService.findAll();
    }

    async update(ctx: Context) {
        const id = ctx.params.id;
        const dto = plainToInstance(UpdateUserDto, ctx.request.body);
        const errors = await validate(dto, {skipMissingProperties: true});
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.userService.updateById(id, dto);
    }

    async delete(ctx: Context) {
        const id = ctx.params.id;
        await this.userService.deleteById(id);
        ctx.status = 204;
    }
}