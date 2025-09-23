import {injectable} from "inversify";
import {UserDocument, UserModel} from "../models/user.schema";
import {CreateUserDto, UpdateUserDto} from "../dtos/user.dto";

@injectable()
export class UserRepository{
    async findAll(): Promise<UserDocument[]> {
        return UserModel.find({}, {__v: 0}).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null>{
        return UserModel.findOne({email}, {__v: 0}).exec()
    }

    async create(dto: CreateUserDto): Promise<UserDocument>{
        const user = new UserModel(dto)
        return  user.save()
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserDocument | null>{
        return UserModel.findByIdAndUpdate(id, dto, {new: true, projection: {__v: 0}}).exec()
    }

    async delete(id: string): Promise<UserDocument | null>{
        return UserModel.findByIdAndDelete(id, {projection: {__v: 0}}).exec()
    }
}