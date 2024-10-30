export const mockUsers = Array(20).fill(null).map((_, index) => ({
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