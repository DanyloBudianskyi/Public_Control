import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ReportRepository} from "../repositories/report.repository";
import {CreateReportDto, ReportResponseDto, UpdateReportDto} from "../dtos/report.dto";
import {ReportDocument} from "../models/report.schema";
import {Types} from "mongoose";
import {NotFoundError} from "../errors/app-err";

@injectable()
export class ReportService {
    constructor(
        @inject(TYPES.ReportRepository) private reportRepository: ReportRepository
    ) {
    }

    async findAll(): Promise<ReportResponseDto[]>{
        const reports = await  this.reportRepository.findAll()
        return reports.map(toReportResponseDto)
    }

    async findById(id: string): Promise<ReportResponseDto> {
        const report = await this.reportRepository.findById(id);
        if (!report) throw new NotFoundError(`Report with id "${id}" not found`);
        return toReportResponseDto(report);
    }

    async findByUserId(userId: string): Promise<ReportResponseDto[]> {
        const reports = await this.reportRepository.findByUserId(userId);
        return reports.map(toReportResponseDto);
    }

    async create(dto: CreateReportDto): Promise<ReportResponseDto> {
        const report = await this.reportRepository.create(dto);
        return toReportResponseDto(report);
    }

    async updateById(id: string, dto: UpdateReportDto): Promise<ReportResponseDto> {
        const report = await this.reportRepository.update(id, dto);
        if (!report) throw new NotFoundError(`Report with id "${id}" not found`);
        return toReportResponseDto(report);
    }

    async deleteById(id: string): Promise<void> {
        const report = await this.reportRepository.delete(id);
        if (!report) throw new NotFoundError(`Report with id "${id}" not found`);
    }
}

function toReportResponseDto(report: ReportDocument): ReportResponseDto {
    return {
        id: report.id,
        description: report.description,
        category: report.category,
        photoUrl: report.photoUrl,
        latitude: report.latitude,
        longitude: report.longitude,
        createdAt: report.createdAt.toISOString(),
        user: report.userId && typeof report.userId === "object"
            ? {
                id: (report.userId as any).id,
                name: (report.userId as any).name,
                lastName: (report.userId as any).lastName,
            }
            : { id: (report.userId as Types.ObjectId).toString() }
    };
}