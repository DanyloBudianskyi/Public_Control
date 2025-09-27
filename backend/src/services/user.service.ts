import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../repositories/user.repository";
import {CreateUserDto, UpdateUserDto, UserResponseDto} from "../dtos/user.dto";
import {UserDocument} from "../models/user.schema";
import {ConflictError, NotFoundError, UnauthorizedError} from "../errors/app-err";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
const SECRET = 'secret123';

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
            const passwordHash = await bcrypt.hash(dto.password, 10)
            const user = await this.userRepository.create({
                ...rest, passwordHash
            } as any)
            const token = jwt.sign({ id: user._id }, SECRET);
            return {user: toUserResponseDto(user, true), token}
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

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(`User with email "${email}" not found`);
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const token = jwt.sign({ id: user._id }, SECRET);

        return {
            user: toUserResponseDto(user, true),
            token,
        };
    }
}

function toUserResponseDto(user: UserDocument, includeEmail = false): UserResponseDto {
    const dto = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
    } as UserResponseDto;

    if (includeEmail) {
        dto.email = user.email;
    }
    return dto;
}