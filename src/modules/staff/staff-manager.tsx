'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
    Search,
    Plus,
    MoreVertical,
    Mail,
    UserCircle,
    Phone,
    Trash2,
    User,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    GraduationCap,
    UserCheck,
    UserX,
    Users,
    HardHat,
    FolderDot,
    FolderKanban,
    SquareTerminal,
    Headset,
    ImageUp,
    Loader2,
    UserPen
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import Image from 'next/image'

type UserFormData = {
    uid?: string | number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    photoURL: string;
    phoneNumber: string;
    status: string;
}

type UserFormProps = {
    user: UserFormData;
    isEdit: boolean;
    onSubmit?: (userData: Partial<UserFormData>) => void;
}

const mockUsers = Array(20).fill(null).map((_, index) => ({
    uid: index + 1,
    name: `User ${index + 1}`,
    lastName: `LastName ${index + 1}`,
    email: `user${index + 1}@example.com`,
    username: `user${index + 1}`,
    password: 'securePassword123',
    role: ['Admin', 'Manager', 'Operator', 'Developer', 'Support'][Math.floor(Math.random() * 5)],
    photoURL: `/placeholder.svg?height=100&width=100`,
    phoneNumber: `+1234567${index.toString().padStart(3, '0')}`,
    status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
}))

export default function UserManagementDashboard() {
    const [users] = useState(mockUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
    const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserFormData | null>(null)
    const [viewingUser, setViewingUser] = useState<UserFormData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState(users)
    const usersPerPage = 10

    useEffect(() => {
        const filtered = users.filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'All' || user.role === roleFilter) &&
            (statusFilter === 'All' || user.status === statusFilter)
        )
        setFilteredUsers(filtered)
        setCurrentPage(1)
    }, [users, searchTerm, roleFilter, statusFilter])

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

    const handleEditUser = (userData: Partial<UserFormData>) => {
        if (!editingUser) return;

        setIsLoading(true)

        const updatedUser = users.map(user => user?.uid === (editingUser as UserFormData)?.uid ? { ...user, ...userData } : user);

        console.log(updatedUser, '-  as updated user');
    }

    const handleDeleteUser = (userId: number) =>
        console.log(userId, '-  as deleted user')

    const UserForm = ({ user, isEdit }: UserFormProps) => {
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

        const onSubmitForm = (data: UserFormData) => {
            if (isEdit) {
                const changedFields = Object?.keys(data)?.reduce((acc, key) => {
                    if (data[key as keyof UserFormData] !== user[key as keyof UserFormData]) {
                        acc[key as keyof UserFormData] = data[key as keyof UserFormData] as string | undefined;
                    }
                    return acc;
                }, {} as Partial<UserFormData>)

                const { photoURL, ...restOfUserData } = data

                if (photoURL && !photoURL?.toLocaleLowerCase()?.includes('.png')) {
                    console.log('upload image first, then append to - ', restOfUserData)
                } else {
                    console.log(changedFields, '- as changed fields for user no need to update image-- ', user.uid)
                }
            } else {
                const { photoURL, ...restOfUserData } = data

                console.log(photoURL, '- upload image first', restOfUserData, '- as new user',)
            }
        }

        const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setValue('photoURL', reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        }, [setValue])

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
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin stroke-white" strokeWidth={1} size={16} /> : (isEdit ? 'Update User' : 'Save User')}
                    </Button>
                </DialogFooter>
            </form>
        )
    }

    const UserDetailsView = ({ user }: { user: UserFormData }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full flex justify-center">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>{user.name[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                </Label>
                <p>{user.name} {user.lastName}</p>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Username
                </Label>
                <p>{user.username}</p>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                </Label>
                <p>{user.email}</p>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                </Label>
                <p>{user.phoneNumber}</p>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Role
                </Label>
                <p>{user.role}</p>
            </div>
            <div>
                <Label className="font-bold flex items-center gap-2">
                    {user.status === 'Active' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Status
                </Label>
                <p>{user.status}</p>
            </div>
        </div>
    )

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-full">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">
                                <span className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Admin">
                                <span className="flex items-center gap-2">
                                    <FolderDot className="h-4 w-4" />
                                    Admin
                                </span>
                            </SelectItem>
                            <SelectItem value="Manager">
                                <span className="flex items-center gap-2">
                                    <FolderKanban className="h-4 w-4" />
                                    Manager
                                </span>
                            </SelectItem>
                            <SelectItem value="Operator">
                                <span className="flex items-center gap-2">
                                    <HardHat className="h-4 w-4" />
                                    Operator
                                </span>
                            </SelectItem>
                            <SelectItem value="Developer">
                                <span className="flex items-center gap-2">
                                    <SquareTerminal className="h-4 w-4" />
                                    Developer
                                </span>
                            </SelectItem>
                            <SelectItem value="Support">
                                <span className="flex items-center gap-2">
                                    <Headset className="h-4 w-4" />
                                    Support
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">
                                <span className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    All
                                </span>
                            </SelectItem>
                            <SelectItem value="Active">
                                <span className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                    Active
                                </span>
                            </SelectItem>
                            <SelectItem value="Inactive">
                                <span className="flex items-center gap-2">
                                    <UserX className="h-4 w-4 text-red-500" />
                                    Inactive
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[90vw] max-h-[85vh] overflow-y-auto bg-card">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                        </DialogHeader>
                        <UserForm
                            user={{
                                name: '',
                                lastName: '',
                                email: '',
                                username: '',
                                password: '',
                                role: 'Operator',
                                photoURL: '',
                                phoneNumber: '',
                                status: 'Active'
                            }}
                            isEdit={false}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {currentUsers.map(user => (
                    <Card key={user.uid} className="relative">
                        <CardContent className="pt-4 px-4 pb-2">
                            <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-6 w-6 p-0">
                                            <MoreVertical className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => {
                                            setViewingUser(user)
                                            setIsViewUserModalOpen(true)
                                        }}>
                                            <User className="mr-2 h-4 w-4" />
                                            View user
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => {
                                            setEditingUser(user)
                                            setIsEditUserModalOpen(true)
                                        }}>
                                            <GraduationCap className="mr-2 h-4 w-4" />
                                            Edit user
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteUser(user.uid)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete user
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex flex-col items-center">
                                <Avatar className="w-16 h-16 mb-2">
                                    <AvatarImage src={user.photoURL} alt={user.name} />
                                    <AvatarFallback>{user.name[0]}{user.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-sm font-semibold text-center">{user.name} {user.lastName}</h2>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]">{user.email}</span>
                                </div>
                                <div className='flex items-center justify-center gap-2 mt-2'>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <UserPen className="h-3 w-3" />
                                        <span>{user.role}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        {user.status === 'Active' ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-red-500" />
                                        )}
                                        <span>{user.status}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredUsers.length > usersPerPage && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
                <DialogContent className="sm:max-w-[90vw] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user details.</DialogDescription>
                    </DialogHeader>
                    {editingUser && <UserForm user={editingUser} onSubmit={handleEditUser} isEdit={true} />}
                </DialogContent>
            </Dialog>

            <Dialog open={isViewUserModalOpen} onOpenChange={setIsViewUserModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {viewingUser && <UserDetailsView user={viewingUser} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
