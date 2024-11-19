"use client"

import * as z from 'zod'
import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from 'react'
import { Form, FormLabel, FormItem, FormField, FormMessage, FormControl } from "../ui/form"
import { Input } from '../ui/input'
import { ResetSchema } from "@/schemas"
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { reset } from '@/actions/reset'
import { Button } from '../ui/button'
import Link from 'next/link'

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
setError("");
setSuccess("");

        startTransition(() => {
            reset(values).then((data: any | undefined) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };

    return (
        <CardWrapper 
            headerLable="Forgot password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField 
                            control={form.control} 
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder='example@gmail.com'
                                            type='email'
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
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
