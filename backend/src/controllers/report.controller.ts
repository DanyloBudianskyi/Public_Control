import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ReportService} from "../services/report.service";
import {Context} from "koa";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ValidationError} from "../errors/app-err";
import {formatValidationErrors} from "../errors/format";
import {CreateReportDto, UpdateReportDto} from "../dtos/report.dto";

@injectable()
export class ReportController{
    constructor(
        @inject(TYPES.ReportService) private reportService: ReportService
    ) {
    }

    async create(ctx: Context) {
        const dto = plainToInstance(CreateReportDto, ctx.request.body);
        dto.userId = ctx.state.user.id;
        const errors = await validate(dto);
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.reportService.create(dto);
        ctx.status = 201;
    }

    async findAll(ctx: Context) {
        ctx.body = await this.reportService.findAll();
    }

    async findOne(ctx: Context) {
        const id = ctx.params.id;
        ctx.body = await this.reportService.findById(id);
    }

    async findByUser(ctx: Context) {
        const userId = ctx.params.userId;
        ctx.body = await this.reportService.findByUserId(userId);
    }

    async findByDate(ctx: Context) {
        const date  = ctx.params.date;

        if (!date || typeof date !== "string") {
            ctx.throw(400, "Query param 'day' is required and must be a string (YYYY-MM-DD)");
        }

        ctx.body = await this.reportService.findByDate(date);
    }

    async update(ctx: Context) {
        const id = ctx.params.id;
        const dto = plainToInstance(UpdateReportDto, ctx.request.body);
        const errors = await validate(dto, { skipMissingProperties: true });
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.reportService.updateById(id, dto);
    }

    async delete(ctx: Context) {
        const id = ctx.params.id;
        await this.reportService.deleteById(id);
        ctx.status = 204;
    }

    async getAllReportDates(ctx: Context) {
        const dates = await this.reportService.getAllReportDates();
        ctx.body = dates;
    }
}