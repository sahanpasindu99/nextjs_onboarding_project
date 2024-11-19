"use client"

import * as z from 'zod'
import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from 'react'
import { Form, FormLabel, FormItem, FormField, FormMessage, FormControl } from "../ui/form"
import { Input } from '../ui/input'
import { NewPasswordSchema } from "@/schemas"
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { newPassword } from '@/actions/new-password'

export const NewPasswordForm = () => {
    const  searchParams=useSearchParams();
    const token=searchParams.get("token")

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
setError("");
setSuccess("");

        startTransition(() => {
            newPassword(values,token).then((data: any | undefined) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };

    return (
        <CardWrapper 
            headerLable="Enter new password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField 
                            control={form.control} 
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder='******'
                                            type='password'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                   
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className='w-full'
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
