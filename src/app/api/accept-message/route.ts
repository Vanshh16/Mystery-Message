import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth"
import { getServerSession } from 'next-auth/next';


export async function POST(request: Request) {
    
    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        { status: 401 })
    }

    const userId = user?._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages}, {new: true})
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            },
            { status: 500 })
        }
        else {
            return Response.json({
                success: true,
                message: "Message accepting status updated successfully",
                updatedUser
            },
            { status: 200 })
        }
    } catch (error) {
        console.log("Failed to update user status to accept messages", error);
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },
        { status: 500 })
        
    }
}

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        { status: 401 })
    }

    const userId = user?._id
    try {
        const foundUser = await UserModel.findById(userId);
        console.log(foundUser);
        
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
            { status: 404 })
        }
        else {
            return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
                message: "Message accepting status updated successfully"
            },
            { status: 200 })
        }
    } catch (error) {
        console.log("Error in getting message accepting status", error);
        return Response.json({
            success: false,
            message: "Error in getting message accepting status"
        },
        { status: 500 })
    }
}