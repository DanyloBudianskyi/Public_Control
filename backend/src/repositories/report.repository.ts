import {injectable} from "inversify";
import { DateTime } from 'luxon';
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
        const mtStart = DateTime.fromISO(date, { zone: 'America/Denver' }).startOf('day').toUTC();
        const mtEnd = DateTime.fromISO(date, { zone: 'America/Denver' }).endOf('day').toUTC();

        return ReportModel.find({
            createdAt: { $gte: mtStart.toJSDate(), $lte: mtEnd.toJSDate() }
        }, { __v: 0 })
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

    async getAllReportDates(): Promise<string[]> {
        const reports = await ReportModel.find({}, { createdAt: 1 }).exec();

        const datesSet = new Set<string>();

        reports.forEach(r => {
            const dt = DateTime.fromJSDate(r.createdAt, { zone: 'America/Denver' });
            const dateStr = dt.toFormat('yyyy-MM-dd');
            datesSet.add(dateStr);
        });

        return Array.from(datesSet).sort((a, b) => a.localeCompare(b));
    }


}