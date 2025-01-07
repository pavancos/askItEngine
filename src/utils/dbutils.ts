import { userModel } from "../models/User";
export async function retrieveUserByEmail(email: string){
    let user = await userModel.findOne({
        email: email
    });
    return user;
}
export async function retrieveUserById(id: string){
    let user = await userModel.findById(id);
    return user;
}
export async function createUser(user:any){
    let newUser = await userModel.create(user);
    return newUser;
}