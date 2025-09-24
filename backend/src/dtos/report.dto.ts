import { IsNotEmpty, IsString, IsUrl, IsDateString, IsMongoId, IsNumber } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty({ message: "Description is required" })
    @IsString()
    description!: string;

    @IsNotEmpty({ message: "Category is required" })
    @IsString()
    category!: string;

    @IsNotEmpty({ message: "Photo URL is required" })
    @IsUrl({}, { message: "Photo must be a valid URL" })
    photoUrl!: string;

    @IsNotEmpty({ message: "Date is required" })
    @IsDateString({}, { message: "Date must be a valid ISO string" })
    date!: string;

    @IsNotEmpty({ message: "UserId is required" })
    @IsMongoId({ message: "UserId must be a valid MongoId" })
    userId!: string;

    @IsNotEmpty({ message: "Latitude is required" })
    @IsNumber({}, { message: "Latitude must be a number" })
    latitude!: number;

    @IsNotEmpty({ message: "Longitude is required" })
    @IsNumber({}, { message: "Longitude must be a number" })
    longitude!: number;
}

export class UpdateReportDto {
    @IsString()
    description?: string;

    @IsString()
    category?: string;

    @IsUrl({}, { message: "Photo must be a valid URL" })
    photoUrl?: string;

    @IsDateString({}, { message: "Date must be a valid ISO string" })
    date?: string;

    @IsMongoId({ message: "UserId must be a valid MongoId" })
    userId?: string;

    @IsNumber({}, { message: "Latitude must be a number" })
    latitude?: number;

    @IsNumber({}, { message: "Longitude must be a number" })
    longitude?: number;
}

export class ReportResponseDto {
    id!: string;
    description!: string;
    category!: string;
    photoUrl!: string;
    date!: string;
    userId!: string;
    latitude!: number;
    longitude!: number;
}
