import {IsNotEmpty, IsString, Length, IsEmail, IsOptional} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'Name is required'})
    @Length(2, 50, {message: 'Name must be between 2 and 50 characters'})
    @IsString()
    name!:string;

    @IsNotEmpty({message: 'Last name is required'})
    @Length(2, 50, {message: 'Last name must be between 2 and 50 characters'})
    @IsString()
    lastName!:string;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be valid'})
    email!: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @Length(6, 20, { message: "Password must be at least 6 characters" })
    password!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @Length(2, 50, {message: 'Name must be between 2 and 50 characters'})
    @IsString()
    name?:string;

    @IsOptional()
    @Length(2, 50, {message: 'Last name must be between 2 and 50 characters'})
    @IsString()
    lastName?:string;

    @IsOptional()
    @IsEmail({}, {message: 'Email must be valid'})
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6, 20, { message: "Password must be at least 6 characters" })
    password?: string;
}

export class LoginUserDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email must be valid" })
    email!: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString({ message: "Password must be a string" })
    password!: string;
}

export class UserResponseDto {
    id!:string;
    name!: string;
    lastName!: string;
    email?:string;
}