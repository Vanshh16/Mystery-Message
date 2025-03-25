"use client"

import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import * as z from "zod"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schema/messageSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import suggestions from "@/suggestions.json"

type CardProps = React.ComponentProps<typeof Card>

function MessagePage({ className, ...props }: CardProps) {

  const params = useParams<{ username: string }>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestiveMessages, setSuggestiveMessages] = useState(["What's a goal or dream you're currently working towards?", "If you could spend a day with any living person, who would it be and what would you do?", "What's a song or piece of music that always lifts your spirits?"]);
  const username = params.username;
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })
  const { register, watch, setValue } = form
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {

    // console.log(data);
    // console.log(content);
    try {
      const response = await axios.post("/api/send-message", { username, content })
      toast({
        title: "Message sent succesfully",
        description: "",
        variant: "default",
      });
      setContent("")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to send message",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });

    }
  }

  useEffect(() => {
    setValue("content", content)
    console.log(content);
  }, [content])


  const suggestMessage = async () => {

    try {
      const response = await axios.post("/api/suggest-messages")
      const str = response.data.data;
      const arr = str.substring(1, str.length-2).split(" || ");
      // const shuffled = suggestions.sort(() => 0.5 - Math.random());
      // let selected = shuffled.slice(0, 3);
      setSuggestiveMessages(arr)
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 1500)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to send message",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  }

  const handleClick = async (notification: any) => {
    setContent(notification)
    console.log(notification);

    console.log(content);


  }

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 mt-8">
        <div className="w-full max-w-5xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
              Public Profile Link
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                // name="content"
                {...register("content")}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold mb-4">Send anonymous message to {username}</FormLabel>
                    <FormControl>
                      <Input className='w-full h-16 text-md' placeholder="Write your message here" {...field} onChange={(e) => {
                        field.onChange(e)
                        setContent(e.target.value)
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-center'>
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </Form>
          <Button type='button' onClick={suggestMessage} className="w-40">
            Suggest Messages
          </Button>
          <Card  {...props}>
            <CardHeader className='mt-0 pt-4'>
              <CardTitle className='text-3xl font-semibold'>Messages</CardTitle>
              <CardDescription className='pt-2'>Click on any message below to select it</CardDescription>
            </CardHeader>
            <CardContent className="grid mb-1 gap-4">
              {
                suggestiveMessages.map((message, index) => (
                  <div key={index+1} className=" flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 text-center space-y-2">
                      {
                        isLoading ? (<Skeleton className="h-4 w-[250px]" />) :
                         (<p key={index} onClick={() => handleClick(message)} className="text-md cursor-pointer font-medium leading-none">
                          {message}
                        </p>)
                      }
                    </div>
                  </div>
                ))
              }
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </>
  )
}

export default MessagePage


// {
//   isLoading ? (<Skeleton className="h-4 w-[250px]" />): (<p onClick={() => handleClick(message)} className="text-md cursor-pointer font-medium leading-none">
//   {message}
// </p>)
// }