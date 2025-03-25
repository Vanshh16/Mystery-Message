import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schema/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();
    try {

        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("Username validation result: ", result);
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            // console.log(result.error);
            
            return Response.json({
                success: false,
                message: usernameErrors?.length>0 ?usernameErrors.join(', ') : "Inavlid query parameters"
            },
            { status: 400 })
        }
        
        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({username: username, isVerified:true})
        console.log("Existing Verified User: ", existingVerifiedUser);
        
        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
            { status: 400 })
        }
        else {
            return Response.json({
                success: true,
                message: "Username is available"
            },
            { status: 200 })
        }
    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },
        { status: 400 })
    }
}