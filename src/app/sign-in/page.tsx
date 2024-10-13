'use client'

import { create } from 'zustand'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import signInCover from "../../assets/covers/signincover.jpg"
import { Loader2 } from 'lucide-react'
import { useSessionStore } from '@/session/session.provider'

type SignInInputs = {
    username: string;
    password: string;
};

interface PasswordVisibilityState {
    isPasswordVisible: boolean
    togglePasswordVisibility: () => void
}

interface SignInState extends PasswordVisibilityState {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

const useSignInStore = create<SignInState>((set) => ({
    isPasswordVisible: false,
    togglePasswordVisibility: () => set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

const signInUser = async (data: SignInInputs) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, data)
    return response?.data
}

export default function Page() {
    const signIn = useSessionStore((state) => state?.signIn)
    const { register, handleSubmit, formState: { errors } } = useForm<SignInInputs>();
    const { isPasswordVisible, togglePasswordVisibility, isLoading, setIsLoading } = useSignInStore()

    const mutation = useMutation({
        mutationFn: signInUser,
        onError: (error) => {
            setIsLoading(false)
            toast(`${error?.message}`,
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '5px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        },
        onSuccess: (data) => {
            setIsLoading(false)
            if (data.status === 'Success') {
                signIn({
                    user: data.user,
                    message: data.message,
                    status: 'authenticated',
                    token: data.token
                })
                toast(`${data?.message}`,
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '5px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            } else {
                toast(`${data?.message}`,
                    {
                        icon: '⛔',
                        style: {
                            borderRadius: '5px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        },
    })

    const onSubmit: SubmitHandler<SignInInputs> = (data) => {
        const { username, password } = data

        setIsLoading(true)

        const signInData = {
            username: username,
            password: password
        }

        mutation.mutate(signInData)
    };

    return (
        <div className="w-full flex items-center justify-between h-full overflow-hidden bg-signInCover bg-cover bg-no-repeat">
            <div className="hidden bg-muted lg:block md:w-1/2 xl:w-2/3 h-full">
                <Image
                    src={signInCover}
                    alt="Image"
                    width="1920"
                    height="1080"
                    priority
                    quality={100}
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex items-center justify-center py-12 w-2/3 md:w-1/2 mx-auto xl:w-1/3 lg:h-full bg-card">
                <div className="w-10/12 flex flex-col justify-start gap-4 border p-3">
                    <div className="flex flex-col items-center justify-center gap-0 text-center">
                        <h1 className="text-3xl font-bold">Warese Sense</h1>
                        <p className="text-balance text-muted-foreground -mt-1 text-xs">
                            Enter your email below to sign in to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="flex items-start gap-1 flex-col">
                            <Label htmlFor="email">Username</Label>
                            <Input
                                id="email"
                                type="email"
                                disabled={isLoading}
                                placeholder="demo@warese.co.za"
                                className="w-full placeholder:text-xs placeholder:italic"
                                {...register("username", {
                                    required: "*username is required",
                                })}
                            />
                            {errors.username && <span className="text-red-500 text-xs -mt-1">{errors.username.message}</span>}
                        </div>
                        <div className="flex items-start gap-1 flex-col">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative w-full flex items-center justify-between">
                                <Input
                                    disabled={isLoading}
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="**************"
                                    className="w-full pr-10 placeholder:text-xs placeholder:italic"
                                    {...register("password", {
                                        required: "*password is required"
                                    })}
                                />
                                <span className="absolute right-2 cursor-pointer uppercase text-[9px]" onClick={togglePasswordVisibility}>{isPasswordVisible ? 'Hide' : 'Show'}</span>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" strokeWidth={1.5} size={16} /> : 'SIGN IN'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}