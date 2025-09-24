import mongoose, {Document, Types} from 'mongoose'

export interface  UserDocument extends Document{
    _id: Types.ObjectId,
    email: string,
    name: string,
    lastName: string,
    passwordHash: string
}

const UserSchema = new mongoose.Schema<UserDocument>({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    passwordHash: {type: String, required: true},
}, {timestamps: true}
)

UserSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

export const UserModel = mongoose.model<UserDocument>('User', UserSchema)