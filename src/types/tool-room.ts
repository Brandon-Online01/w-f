export interface ToolRoom {
    uid: number,
    eta: string,
    checkInDate: string
    checkOutDate: string
    componentName: string
    completedTime: string
    workDone: string
    turnaroundTime: number
    damageRating: number
    inspectionRating: number
    factoryReferenceID: string
    status: 'In Progress' | 'Completed'
    teamMembers?: []
    materialsUsed?: []
    mouldId: number
    teamMemberIds: number[]
}