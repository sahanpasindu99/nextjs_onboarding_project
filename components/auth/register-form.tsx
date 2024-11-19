"use client"

import * as z from 'zod'
import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from 'react'
import {Form, FormLabel,FormItem,FormField,FormMessage, FormControl } from "../ui/form"
import { Input } from '../ui/input'
import { RegisterSchema } from '@/schemas'
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { register } from '@/actions/register'

export const RegisterForm=()=>{

    const [error,setError]=useState<string | undefined>('');

    const [success,setSuccess]=useState<string | undefined>('');
    const [isPending,startTransition]=useTransition();
    const form=useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            email:"",
            password:"",
            name:""
        },
    })

    const onSubmit=(values:z.infer<typeof RegisterSchema>)=>{
        startTransition(()=>{
            register(values).
            then((data)=>{
                setError(data.error);
                setSuccess(data.success);
            })

        });
    }

    return(
        <CardWrapper headerLable="Register here!"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocial
        >
            <Form {...form} >
                  <form onClick={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                    >
                        <div className='space-y-4'>
                        <FormField 
                        control={form.control} 
                        name="name"
render={({field})=>(
        <FormItem>
        <FormLabel>
            Name
        </FormLabel>
        <FormControl>
            <Input {...field}
            disabled={isPending}
            
            placeholder='john doe'
            />
        </FormControl>
<FormMessage/>
    </FormItem>
    )}
/>

                        <FormField 
                        control={form.control} 
                        name="email"
render={({field})=>(
        <FormItem>
        <FormLabel>
            Email
        </FormLabel>
        <FormControl>
            <Input {...field}
            disabled={isPending}
            
            placeholder='example@gmail.com'
            type='email'
            />
        </FormControl>
<FormMessage/>
    </FormItem>
    )}
/>
<FormField 
                        control={form.control} 
                        name="password"
render={({field})=>(
        <FormItem>
        <FormLabel>
            Password
        </FormLabel>
        <FormControl>
            <Input {...field}
                        disabled={isPending}

            placeholder='*******'
            type='password'
            />
        </FormControl>
<FormMessage/>
    </FormItem>
    )}
/>

                        </div>
                        <FormSuccess message={success}/>
                        <FormError message={error}/>
                        <Button
                        type="submit"
                        disabled={isPending}
                        className='w-full'
                        >
                            Create an account

                        </Button>

                    </form>
            </Form>
        </CardWrapper>
    )
}