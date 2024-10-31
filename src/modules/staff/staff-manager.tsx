'use client'

import { useState, useEffect } from 'react'
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
import { UserFormData } from '@/types/user';
import { mockUsers } from '@/data/data'
import { UserManagerForm } from './forms/user-manager'

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

    const handleEditUser = async (userData: Partial<UserFormData>) => {
        if (!editingUser) return;

        setIsLoading(true)

        const updatedUser = users?.map((user: { uid: string | number | undefined }) => user?.uid === (editingUser as UserFormData)?.uid ? { ...user, ...userData } : user);

        console.log(updatedUser, '-  as updated user');
    }

    const handleDeleteUser = (userId: number) => console.log(userId, '-  as deleted user')


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

    const SectionHeader = () => {
        return (
            <>
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" strokeWidth={1.5} size={18} />
                    <Input
                        type="text"
                        placeholder="search staff..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)}
                    />
                </div>
            </>
        )
    }

    const SectionFilters = () => {
        return (
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
        )
    }

    const UserCard = () => {
        return (
            <>
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
            </>
        )
    }

    const Pagination = () => {
        return (
            <>
                {filteredUsers?.length > usersPerPage && (
                    <div className="flex justify-center items-center space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                            <ChevronLeft className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                        </Button>
                        <span className="text-sm">{currentPage} of {totalPages}</span>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                            <ChevronRight className="stroke-card-foreground" strokeWidth={1.5} size={16} />
                        </Button>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="w-full flex flex-col justify-start items-center gap-2">
            <div className="flex flex-col lg:flex-row gap-2 w-full">
                <SectionHeader />
                <SectionFilters />
                <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[90vw] max-h-[85vh] overflow-y-auto bg-card" aria-describedby="create-user-details">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                        </DialogHeader>
                        <UserManagerForm
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
                <UserCard />
            </div>
            <Pagination />
            <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
                <DialogContent className="sm:max-w-[90vw] max-h-[85vh] overflow-y-auto bg-card" aria-describedby="edit-user-details">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user details.</DialogDescription>
                    </DialogHeader>
                    {editingUser && <UserManagerForm user={editingUser} onSubmit={handleEditUser} isEdit={true} />}
                </DialogContent>
            </Dialog>
            <Dialog open={isViewUserModalOpen} onOpenChange={setIsViewUserModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card" aria-describedby="view-user-details">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {viewingUser && <UserDetailsView user={viewingUser} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
