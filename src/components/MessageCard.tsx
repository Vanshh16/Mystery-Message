"use client"

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";

type MessageCardProp = {
  message: Message,
  onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProp) {

  const d = new Date(message.createdAt)
  const dt = d.toString().substring(0, 15) + ", " + d.toString().substring(15, 21)


  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`)
    toast({
      title: response.data.message
    })
    onMessageDelete(message._id as string)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message?.content}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex">
      <CardFooter className="mt-8">
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-10 h-10" variant="destructive">X</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </CardFooter>
      <CardFooter className="ml-36 mt-10">{dt}</CardFooter>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
