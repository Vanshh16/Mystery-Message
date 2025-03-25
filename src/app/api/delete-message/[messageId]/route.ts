import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth"
import { getServerSession } from 'next-auth/next';

export async function DELETE(request: Request, {params}: {params: {messageId: string}}) {

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    const messageId = params.messageId
    dbConnect()
    if(!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
        { status: 401 })
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            },
            { status: 401 })
        }
        else {
            return Response.json({
                success: true,
                message: "Message deleted"
            },
            { status: 200 })
        }
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error deleting message"
        },
        { status: 500 })
    }
    
    
}
            