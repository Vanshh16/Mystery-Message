import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth"
import mongoose from "mongoose";
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User
    dbConnect()
    if(!session || !_user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        { status: 401 })
    }

    const userId = new mongoose.mongo.ObjectId(_user?._id);
    // console.log(userId);
    
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: {"messages.createdAt": -1 } },
            { $group: {_id: "$_id", messages: {$push: "$messages"}} }
        ]).exec()
        // console.log(user);
        
        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            { status: 404 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },
        { status: 200 })
    } catch (error) {
        console.log("Unexpected error occurred", error);
        
        return Response.json({
            success: false,
            message: "Unexpected error occurred"
        },
        { status: 500 })
    }
}
            