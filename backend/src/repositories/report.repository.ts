import {injectable} from "inversify";
import {ReportDocument, ReportModel} from "../models/report.schema";
import {CreateReportDto, UpdateReportDto} from "../dtos/report.dto";

@injectable()
export class ReportRepository{
    async findAll(): Promise<ReportDocument[]> {
        return ReportModel.find({}, {__v: 0}).populate("userId", "name lastName").exec();
    }

    async findById(id: string): Promise<ReportDocument | null> {
        return  ReportModel.findById(id, {__v: 0}).populate("userId", "name lastName").exec();
    }

    async findByUserId(userId: string): Promise<ReportDocument[]> {
        return  ReportModel.find({userId}, {__v: 0}).populate("userId", "name lastName").exec();
    }

    async findByDate(date: string): Promise<ReportDocument[]> {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return ReportModel.find({createdAt: { $gte: start, $lte: end }}, { __v: 0 })
            .populate("userId", "name lastName")
            .exec();
    }


    async create(dto: CreateReportDto): Promise<ReportDocument>{
        const report = new ReportModel(dto)
        return report.save()
    }

    async update(id: string, dto: UpdateReportDto): Promise<ReportDocument | null>{
        return ReportModel.findByIdAndUpdate(id, dto, {new: true, projection: {__v: 0}}).populate("userId", "name lastName").exec();
    }

    async delete(id: string): Promise<ReportDocument | null>{
        return ReportModel.findByIdAndDelete(id, {projection: {__v: 0}}).populate("userId", "name lastName").exec();
    }
}