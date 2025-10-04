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
        const dates = await ReportModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day"
                        }
                    }
                }
            }
        ]);

        return dates.map(d => d.date.toISOString().split("T")[0]);
    }

}