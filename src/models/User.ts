import IUser from "./IUser";
import mongoose, { Schema, Document } from "mongoose";

export interface IUserModel extends IUser {
    id: string;
}

class User {
   private userSchema: Schema<IUserModel>;

    constructor() {
        this.userSchema = new Schema<IUserModel>({
            username: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true } 
        });

        this.userSchema.method('toJSON', function (this: Document) {
            const {_id, __v, password, ...object} = this.toObject();
            object.id = _id.toString();
            return object;
        });
    }

    public getModel = () => {
        return mongoose.model<IUserModel>('User', this.userSchema);
    }

    
}

export default new User();