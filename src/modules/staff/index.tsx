'use client'

import { useState, useRef } from 'react'
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Edit,
    Eye,
    Trash2,
    User,
    Shield,
    Users,
    UserPlus,
    Upload,
    Mail,
    Activity,
    IdCard
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

// Sample user data
const initialUsers = [
    {
        "uid": 1,
        "name": "Brandon",
        "lastName": "Nkawu",
        "email": "brandonnkawu01@gmail.com",
        "username": "brandon",
        "password": "$2b$10$aI4LDV9iu5HyytAlxfIM..pkSFes1OLGD8Kh.FHv/uQhNgJfBoF9y",
        "role": "Admin" as const,
        "photoURL": "https://storage.googleapis.com/hrs-docs/naartjie.png",
        "phoneNumber": "0739590288",
        "status": "Active" as const
    }
]       

// Validation schema
const userSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    role: z.enum(["Admin", "User", "Editor"], { required_error: "Role is required" }),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    status: z.enum(["Active", "Inactive"], { required_error: "Status is required" }),
    photoURL: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

export default function StaffManagement() {
    const [users, setUsers] = useState<Array<UserFormData & { uid: number, password: string }>>(initialUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8) // Update 1: Initial itemsPerPage is now 8
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
    const [isEditUserOpen, setIsEditUserOpen] = useState(false)
    const [isViewUserOpen, setIsViewUserOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<(UserFormData & { uid: number, password: string }) | null>(null)
    const [viewingUser, setViewingUser] = useState<(UserFormData & { uid: number, password: string }) | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

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
            password: '', // In a real application, you'd handle password creation securely
            photoURL: data.photoURL || '/placeholder.svg?height=100&width=100',
        }
        setUsers([...users, newUser])
        setIsCreateUserOpen(false)
    }

    const handleEditUser: SubmitHandler<UserFormData> = (data) => {
        const updatedUser = {
            ...editingUser!,
            ...data,
        }
        setUsers(users.map(user => user.uid === updatedUser.uid ? updatedUser : user))
        setIsEditUserOpen(false)
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
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <UserPlus className="mr-2 h-4 w-4" /> Create User
                        </Button>
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

        return (
            <Card key={uid} className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={photoURL} alt={`${name} ${lastName}`} />
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
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => {
                                            setViewingUser(user)
                                            setIsViewUserOpen(true)
                                        }}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteUser(user.uid)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
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
                    {editingUser && <UserForm user={editingUser} onSubmit={handleEditUser} />}
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
                    {viewingUser && <ViewUserModal user={viewingUser} />}
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
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{currentPage} of {pageCount}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
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
            resolver: zodResolver(userSchema),
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

        return (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={photoURL} alt={`${name} ${lastName}`} />
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
                {paginatedUsers.map((user, index) => <UserCard key={index} user={user} />)}
            </div>
            <PaginationControls />
            <EditModal />
            <ViewModal />
        </div>
    )
}