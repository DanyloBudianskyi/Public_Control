import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../repositories/user.repository";
import {CreateUserDto, UpdateUserDto, UserResponseDto} from "../dtos/user.dto";
import {UserDocument} from "../models/user.schema";
import {ConflictError, NotFoundError} from "../errors/app-err";
import bcrypt from "bcrypt"

@injectable()
export class UserService{
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository
    ) {
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        return users.map(user => toUserResponseDto(user));
    }

    async create(dto: CreateUserDto){
        try {
            const {password, ...rest} = dto
            const passwordHash = await  bcrypt.hash(dto.password, 10)
            const user = await this.userRepository.create({
                ...rest, passwordHash
            } as any)
            return toUserResponseDto(user, true)
        } catch (err: any){
            if(err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictError(`Email "${dto.email}" already exists`)
            }
            throw err
        }
    }

    async updateById(id: string, dto: UpdateUserDto) {
        try {
            const { password, ...rest } = dto;
            let updateData: any = { ...rest };
            if (password) {
                updateData.passwordHash = await bcrypt.hash(password, 10);
            }
            const user = await this.userRepository.update(id, updateData);
            if (!user) throw new NotFoundError(`User with id "${id}" not found`);

            return toUserResponseDto(user, true);
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictError(`Email "${dto.email}" already exists`)
            }
            throw err;
        }
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userRepository.findByEmail(email);
    }

    async deleteById(id: string) {
        const user = await this.userRepository.delete(id);
        if (!user) throw new NotFoundError(`User with id "${id}" not found`);
    }
}

function toUserResponseDto(user: UserDocument, includeEmail = false): UserResponseDto {
    const dto = {
        id: user.id,
        username: user.username,
    } as UserResponseDto;

    if (includeEmail) {
        dto.email = user.email;
    }
    return dto;
}