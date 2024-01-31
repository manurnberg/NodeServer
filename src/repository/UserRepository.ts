import UserModel, { IUserModel } from '../models/User';

class UserRepository {
    private repository = UserModel;


    public getAllUsers = async (): Promise<IUserModel[]> => {
        return this.repository.getModel().find();
    }

    public getUserById = async (userId: string): Promise<IUserModel | null> => {
        return this.repository.getModel().findById(userId);
    }

    public createUser = async (user: IUserModel): Promise<IUserModel> => {
        return this.repository.getModel().create(user);
    }

    public updateUser = async (userId: string, updateUser: IUserModel): Promise<IUserModel | null> => {
        return this.repository.getModel().findByIdAndUpdate(userId, updateUser, { new: true });
    }

    public deleteUser = async (userId: string): Promise<void> => {
        await this.repository.getModel().findByIdAndDelete(userId);
    }

    public getUserByUsernameOrEmail = async (usernameOrEmail: string): Promise<IUserModel | null> => {
        return this.repository.getModel().findOne({
            $or: [{username: usernameOrEmail}, {email: usernameOrEmail}],
        });
    }
}

export default new UserRepository();