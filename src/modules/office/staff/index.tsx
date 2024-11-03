'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Edit,
    User,
    Shield,
    Users,
    UserPlus,
    Upload,
    Mail,
    Activity,
    IdCard,
    UserPen,
    UserSearch,
    UserX,
    Loader2,
} from 'lucide-react'
import { Phone, UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import userPlaceHolderIcon from '@/assets/svg/user-placeholder.svg'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { newUserSchema, editUserSchema } from '@/schemas/user'
import { userList } from '@/data/data'
import { useOfficeStore } from '../state/state'
import { NewUserType } from '@/types/user'
import { motion } from 'framer-motion'
import { isEmpty } from 'lodash'

type UserFormData = z.infer<typeof newUserSchema>

export default function StaffManagement() {
    const {
        users,
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        isCreating,
        isEditing,
        isViewing,
        editingUser,
        viewingUser,
        isLoading,
        setUsers,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setIsCreating,
        setIsEditing,
        setIsViewing,
        setEditingUser,
        setViewingUser,
        setIsLoading,
    } = useOfficeStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setIsLoading(true)
        const allUsers = async () => {
            const users = await userList()
            setUsers(users?.data)
        }

        allUsers()
        setIsLoading(false)
    }, [setUsers, setIsLoading]);

    const filteredUsers = users?.filter(user =>
        (user?.name?.toLowerCase() + ' ' + user?.lastName.toLowerCase())?.includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || user?.role === statusFilter)
    )

    const pageCount = Math.ceil(filteredUsers?.length / itemsPerPage)

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCreateUser: SubmitHandler<NewUserType> = async (data) => console.log(data)

    const handleEditUser: SubmitHandler<UserFormData> = (data) => console.log(data, 'as updated user data')

    const handleDeleteUser = (uid: number) => console.log(uid, '- delete the user with this uid')

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (preview: string) => void) => {
        if (!event?.target?.files) return

        const file = event?.target?.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const PageHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow w-64 sm:w-96">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="search users..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">
                                <Users className="mr-2 h-4 w-4 inline-block" />
                                All Roles
                            </SelectItem>
                            <SelectItem value="Admin">
                                <Shield className="mr-2 h-4 w-4 inline-block" />
                                Admin
                            </SelectItem>
                            <SelectItem value="User">
                                <User className="mr-2 h-4 w-4 inline-block" />
                                User
                            </SelectItem>
                            <SelectItem value="Editor">
                                <Edit className="mr-2 h-4 w-4 inline-block" />
                                Editor
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end lg:w-64'>
                            <Button className="w-full ">
                                <UserPlus className="mr-2 h-4 w-4" /> Create User
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-card">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <UserForm onSubmit={handleCreateUser} />
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const UserCard = ({ user, index }: { user: UserFormData & { uid: number, password: string }, index: number }) => {
        const { name, lastName, email, status, photoURL = userPlaceHolderIcon, uid } = user

        const userABBR = `${name.charAt(0)}${lastName.charAt(0)}`
        const userPhoto = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`

        return (
            <motion.div
                className="bg-card rounded shadow-md cursor-pointer w-full border"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut", bounce: 0.3 }}>
                <Card key={uid} className="overflow-hidden w-full border">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={userPhoto} alt={`${name} ${lastName}`} />
                                    <AvatarFallback>{userABBR}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="p-4 w-full">
                                <div className="flex items-center justify-start gap-2">
                                    <IdCard className="stroke-card-foreground" strokeWidth={1} size={18} />
                                    <h3 className="font-semibold text-card-foreground">{name} {lastName}</h3>
                                </div>
                                <div className="flex items-center justify-start gap-2">
                                    <Mail className="stroke-card-foreground" strokeWidth={1} size={17} />
                                    <p className="text-sm text-card-foreground">{email}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-start gap-2">
                                        <Activity className="stroke-card-foreground" strokeWidth={1} size={17} />
                                        <span className="text-sm text-card-foreground">{status}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => {
                                                setEditingUser(user)
                                                setIsEditing(true)
                                            }}>
                                                <UserPen className="mr-2 stroke-card-foreground" strokeWidth={1} size={17} />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => {
                                                setViewingUser(user)
                                                setIsViewing(true)
                                            }}>
                                                <UserSearch className="mr-2 stroke-card-foreground" strokeWidth={1} size={17} />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleDeleteUser(user.uid)}>
                                                <UserX className="stroke-red-500 mr-2" strokeWidth={1} size={17} />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    const EditModal = () => {
        return (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[700px] bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {editingUser && <UserForm user={{ ...editingUser, photoURL: editingUser.photoURL || '/placeholder.svg' }} onSubmit={handleEditUser} />}
                </DialogContent>
            </Dialog>
        )
    }

    const ViewModal = () => {
        return (
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent className="sm:max-w-[500px] bg-card">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {viewingUser && <ViewUserModal user={viewingUser as UserFormData & { uid: number, password: string }} />}
                </DialogContent>
            </Dialog>
        )
    }

    const PaginationControls = () => {
        return (
            <div className="flex justify-between items-center">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="8">8 per page</SelectItem>
                        <SelectItem value="16">16 per page</SelectItem>
                        <SelectItem value="32">32 per page</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
                        disabled={currentPage === pageCount}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    const UserForm = ({ user = null, onSubmit }: { user?: UserFormData | null; onSubmit: (data: UserFormData) => void }) => {
        const [imagePreview, setImagePreview] = useState(user?.photoURL || '/placeholder.svg?height=100&width=100')

        const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
            resolver: zodResolver(user ? editUserSchema : newUserSchema),
            defaultValues: user || {},
        })

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-full">
                        <Label htmlFor="photoURL">User Image</Label>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={imagePreview} alt="User avatar" />
                                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <Input
                                id="photoURL"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, setImagePreview)}
                                ref={fileInputRef}
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Upload Image
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="name">First Name</Label>
                            <Input id="name" {...register("name")} placeholder="John" />
                        </div>
                        {errors?.name && <p className="text-red-500 text-xs mt-1">{errors?.name?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                        </div>
                        {errors?.lastName && <p className="text-red-500 text-xs mt-1">{errors?.lastName?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="john.doe@example.com" />
                        </div>
                        {errors?.email && <p className="text-red-500 text-xs mt-1">{errors?.email?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} placeholder="johndoe" />
                        </div>
                        {errors?.username && <p className="text-red-500 text-xs mt-1">{errors?.username?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" {...register("password")} placeholder="********" />
                        </div>
                        {errors?.password && <p className="text-red-500 text-xs mt-1">{errors?.password?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(value) => register("role").onChange({ target: { value } })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">
                                        <span className="flex items-center gap-2">
                                            <Shield className="stroke-card-foreground" strokeWidth={1} size={18} />
                                            Admin
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="User">
                                        <span className="flex items-center gap-2">
                                            <User className="stroke-card-foreground" strokeWidth={1} size={18} />
                                            User
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Editor">
                                        <span className="flex items-center gap-2">
                                            <Edit className="stroke-card-foreground" strokeWidth={1} size={18} />
                                            Editor
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors?.role && <p className="text-red-500 text-xs mt-1">{errors?.role?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+1234567890" />
                        </div>
                        {errors?.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors?.phoneNumber?.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <div className='flex flex-col justify-start gap-1'>
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">
                                        <span className="flex items-center gap-2">
                                            <Activity className="stroke-success" strokeWidth={1} size={18} />
                                            Active
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        <span className="flex items-center gap-2">
                                            <Activity className="stroke-destructive" strokeWidth={1} size={18} />
                                            In Active
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors?.status && <p className="text-red-500 text-xs mt-1">{errors?.status?.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-10/12 mx-auto flex" disabled>
                    {
                        isLoading ? <Loader2 className="mr-2 animate-spin stroke-white" strokeWidth={1.5} size={18} /> :
                            <>
                                {user ? 'Update User' : 'Create User'}
                            </>
                    }
                </Button>
            </form >
        )
    }

    const ViewUserModal = ({ user }: { user: UserFormData & { uid: number, password: string } }) => {
        const { name, lastName, email, username, role, phoneNumber, status, photoURL } = user
        const userPhoto = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`

        return (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={userPhoto} alt={`${name} ${lastName}`} />
                        <AvatarFallback>{name.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Name</Label>
                        </div>
                        <p className="text-sm font-semibold">{name} {lastName}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Email</Label>
                        </div>
                        <p className="text-sm font-semibold">{email}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <UserCircle className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Username</Label>
                        </div>
                        <p className="text-sm font-semibold">{username}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Role</Label>
                        </div>
                        <p className="text-sm font-semibold">{role}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                        </div>
                        <p className="text-sm font-semibold">{phoneNumber}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-gray-500" />
                            <Label className="text-sm font-medium text-gray-500">Status</Label>
                        </div>
                        <p className="text-sm font-semibold">{status}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading || isEmpty(users)) {
        return (
            <div className="w-full h-screen">
                <PageHeader />
                <UserCardsLoader />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
                {paginatedUsers?.map((user, index) => {
                    const userWithDefaultPhoto = {
                        ...user,
                        photoURL: user?.photoURL || userPlaceHolderIcon,
                    };
                    return <UserCard key={index} user={userWithDefaultPhoto} index={index} />;
                })}
            </div>
            <PaginationControls />
            <EditModal />
            <ViewModal />
        </div>
    )
}

const UserCardsLoader = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-card rounded p-4 border shadow animate-pulse flex flex-col justify-start gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}>
                        <div className="aspect-video w-full bg-gray-200 rounded mb-4 h-32 flex items-center justify-center" >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="h-5 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                            <div className="h-5 bg-gray-200 rounded w-1/12" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
