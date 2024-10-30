'use client'

import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
    ImageUp,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { UserFormData, UserFormProps } from '@/types/user';
import { UploadedFile } from '@/types/common.types'
import { useStaffManagerState } from '../state/state'

export const UserManagerForm = ({ user, isEdit }: UserFormProps) => {
    const { imageFile, setImageFile } = useStaffManagerState()
    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<UserFormData>({
        defaultValues: user || {
            name: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            role: 'Operator',
            photoURL: '',
            phoneNumber: '',
            status: 'Active'
        }
    })

    const photoURL = watch('photoURL')

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setImageFile(file as UploadedFile)

            const reader = new FileReader()
            reader.onloadend = () => {
                setValue('photoURL', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [setImageFile, setValue])

    const onSubmitForm = async (data: UserFormData) => {
        if (isEdit) {
            const changedFields = Object?.keys(data)?.reduce((acc, key) => {
                if (data[key as keyof UserFormData] !== user[key as keyof UserFormData]) {
                    acc[key as keyof UserFormData] = data[key as keyof UserFormData] as string | undefined;
                }
                return acc;
            }, {} as Partial<UserFormData>)

            const { photoURL } = data

            if (photoURL && !photoURL?.toLocaleLowerCase()?.includes('.png')) {
                console.log('upload image first', imageFile)
            }

            const updatedUserProfile = {
                ...changedFields,
                photoURL: 'uploaded file name'
            }

            console.log(updatedUserProfile, '- as changed fields for user no need to update image', user?.uid)
        } else {
            if (!imageFile) {
                return;
            }

            console.log(imageFile, '- upload image first as step one')

            const newUserProfile = {
                ...data,
                photoURL: 'uploaded file name'
            }

            console.log(newUserProfile, '- update and save user as step two')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                <div className="space-y-2 col-span-full">
                    <Label htmlFor="photoURL">Profile Photo</Label>
                    <div className="flex items-center gap-4 flex-col md:flex-row">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            {photoURL ? (
                                <Image src={photoURL} alt="Profile" className="w-full h-full object-cover" width={100} height={100} priority quality={100} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center border border-dashed border-card-foreground/20 rounded-full">
                                    <ImageUp className="stroke-card-foreground/20" strokeWidth={1} size={28} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <Label htmlFor="imageUpload" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                                    Upload User Profile Photo
                                </div>
                            </Label>
                        </div>
                    </div>
                    <Controller
                        name="photoURL"
                        control={control}
                        render={({ field }) => <Input {...field} type="hidden" />}
                    />
                </div>
                <div className="space-y-0">
                    <Label htmlFor="name">Name</Label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => <Input {...field} placeholder="John" />}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: 'Last name is required' }}
                        render={({ field }) => <Input {...field} placeholder="Doe" />}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="email">Email</Label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        render={({ field }) => <Input {...field} type="email" placeholder="john@waresense.co.za" />}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="username">Username</Label>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field }) => <Input {...field} placeholder="john.doe" />}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="password">Password</Label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
                        render={({ field }) => <Input {...field} type="password" placeholder="jdoeman@waresense.co.za" />}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="role">Role</Label>
                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: 'Role is required' }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="Operator">Operator</SelectItem>
                                    <SelectItem value="Developer">Developer</SelectItem>
                                    <SelectItem value="Support">Support</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Invalid phone number' } }}
                        render={({ field }) => <Input {...field} placeholder="Enter phone number" />}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-0">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">In Active</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" className="w-full">
                    {isEdit ? 'Update User' : 'Save User'}
                </Button>
            </DialogFooter>
        </form>
    )
}