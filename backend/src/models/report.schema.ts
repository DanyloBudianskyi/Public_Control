import mongoose, {Document, Schema, Types} from "mongoose";
import {UserDocument} from "./user.schema";

export interface ReportDocument extends Document{
    _id: Types.ObjectId,
    description: string,
    category: string,
    photoUrl: string,
    userId: Schema.Types.ObjectId | UserDocument,
    latitude: number,
    longitude: number,
    createdAt: Date,
}

const ReportSchema = new Schema<ReportDocument>({
    description: {type: String, required: true},
    category: {type: String, required: true},
    photoUrl: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
    },
}, {timestamps: true})

ReportSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

export const ReportModel = mongoose.model<ReportDocument>('Report', ReportSchema)