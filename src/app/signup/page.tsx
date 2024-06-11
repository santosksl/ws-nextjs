"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const userSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Name must be at least 4 characters long' }),
    email: z.string().min(4, { message: 'E-mail must be at least 4 characters long'}).email({ message: 'Invalid email format' }),
    password: z
        .string()
        .min(4, { message: 'Password must be at least 4 characters long' }),
});

type UserType = z.infer<typeof userSchema>

export default function SignUp() {
    const form = useForm<UserType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
    })
    
    const { toast } = useToast();
    const router = useRouter()
    
    async function onSubmit(values: UserType) {
        await api.post('/user/signup', values).then(async (res) => {
            //router.push('/login')
            toast({
                className: 'bg-emerald-600',
                description: res.data.message
            })
        }).catch((error) => {
            if (error.response) {
                toast({
                    variant: 'destructive',
                    description: error.response.data.message
                })
            } else if (error.request) {
                console.log('Error Request', error.request)
            } else {
                console.error('Error Api', error);
            }
        })
    }

    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[30%]" method="POST">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Jonh Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="example@gmail.com" {...field}  type="email"/>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                    />
                <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
        </div>
    )
}