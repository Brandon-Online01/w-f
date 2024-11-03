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
    UserX
} from 'lucide-react'
import { Phone, UserCircle } from 'lucide-react'
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
import { useStaffStore } from './state/state'
import { userList } from '@/data/data'
import { newUserSchema } from '@/schemas/user'
import userPlaceHolderIcon from '@/assets/svg/user-placeholder.svg'

type UserFormData = z.infer<typeof newUserSchema>

export default function StaffManagement() {
    const {
        users,
        searchTerm,
        statusFilter,
        currentPage,
        itemsPerPage,
        isCreateUserOpen,
        isEditUserOpen,
        isViewUserOpen,
        editingUser,
        viewingUser,
        setUsers,
        setSearchTerm,
        setStatusFilter,
        setCurrentPage,
        setItemsPerPage,
        setIsCreateUserOpen,
        setIsEditUserOpen,
        setIsViewUserOpen,
        setEditingUser,
        setViewingUser,
    } = useStaffStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const allUsers = async () => {
            const users = await userList()
            setUsers(users?.data)
        }
        allUsers()
    }, [setUsers]);

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase() + ' ' + user.lastName.toLowerCase()).includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'All' || user.role === statusFilter)
    )

    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage)

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleCreateUser: SubmitHandler<UserFormData> = (data) => {
        const newUser = {
            uid: users.length + 1,
            ...data,
            password: '',
            photoURL: data.photoURL || '/placeholder.svg?height=100&width=100',
        }

        console.log(newUser)

        setIsCreateUserOpen(false)
    }

    const handleEditUser: SubmitHandler<UserFormData> = (data) => {
        const updatedUser = {
            ...editingUser!,
            ...data,
        }
        setUsers(users.map(user => user.uid === updatedUser.uid ? updatedUser : user))
        setEditingUser(null)
    }

    const handleDeleteUser = (uid: number) => console.log(uid, '- delete the user with this uid')

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (preview: string) => void) => {
        if (!event.target.files) return

        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
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
                            placeholder="Search users..."
                            className="pl-8 text-[16px]"
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
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                        <div className='w-full flex items-end justify-end'>
                            <Button className="w-full sm:w-1/4">
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

    const UserCard = ({ user }: { user: UserFormData & { uid: number, password: string } }) => {
        const { name, lastName, email, status, photoURL, uid } = user

        const userABBR = `${name.charAt(0)}${lastName.charAt(0)}`
        const userPhoto = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${photoURL}`

        return (
            <Card key={uid} className="overflow-hidden">
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
                                            setIsEditUserOpen(true)
                                        }}>
                                            <UserPen className="mr-2 stroke-card-foreground" strokeWidth={1.5} size={17} />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => {
                                            setViewingUser(user)
                                            setIsViewUserOpen(true)
                                        }}>
                                            <UserSearch className="mr-2 stroke-card-foreground" strokeWidth={1.5} size={17} />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteUser(user.uid)}>
                                            <UserX className="stroke-red-500 mr-2" strokeWidth={1.5} size={17} />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const EditModal = () => {
        return (
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
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
            <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
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
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        variant="outline"
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
            resolver: zodResolver(newUserSchema),
            defaultValues: user || {},
        })

        const currentPhoto = `${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${imagePreview}`

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-full">
                        <Label htmlFor="photoURL">User Image</Label>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={currentPhoto} alt="User avatar" />
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
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Editor">Editor</SelectItem>
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
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors?.status && <p className="text-red-500 text-xs mt-1">{errors?.status?.message}</p>}
                    </div>
                </div>
                <Button type="submit" className="w-full">{user ? 'Update User' : 'Create User'}</Button>
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

    return (
        <div className="w-full flex flex-col justify-start gap-2">
            <PageHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedUsers.map((user, index) => {
                    const userWithDefaultPhoto = {
                        ...user,
                        photoURL: user.photoURL || userPlaceHolderIcon,
                    };
                    return <UserCard key={index} user={userWithDefaultPhoto} />;
                })}
            </div>
            <PaginationControls />
            <EditModal />
            <ViewModal />
        </div>
    )
}