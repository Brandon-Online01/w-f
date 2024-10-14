"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    ArrowUp,
    ArrowDown
} from "lucide-react"
import { motion } from 'framer-motion'
import { useQuery } from "@tanstack/react-query"
import { getReportsData } from "@/helpers/reports"

interface Report {
    uid: number;
    fileName: string;
    date: string;
    shift: string;
    status: string;
    sentTo: string;
    messageID: string;
    reportCreationDate: string;
    extraNotes: string;
    reportType: string;
    reportTitle: string;
}

export default function ReportsManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [reports, setReportsData] = useState<Report[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [shiftFilter, setShiftFilter] = useState("All")
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })

    const { data: reportsData } = useQuery({
        queryKey: ['getReportsData'],
        queryFn: getReportsData,
        refetchInterval: 5000,
        refetchOnMount: true,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (reportsData?.data) {
            setReportsData(reportsData?.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportsData?.data]);

    const filteredReports = reports.filter((report) =>
        report?.reportTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
        (shiftFilter === "All" || report?.shift === shiftFilter)
    )

    const sortedReports = [...filteredReports].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
            return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
            return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentReports = sortedReports.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(sortedReports.length / itemsPerPage)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleDownload = (pdfUrl: string) => {
        const link = document.createElement('a')
        link.href = pdfUrl
        link.download = pdfUrl.split('/').pop() || 'report.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

    const handleShiftFilterChange = (value: string) => {
        setShiftFilter(value)
        setCurrentPage(1)
    }

    const handleSort = (key: string) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    const PageHeader = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center">
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, z: -20 }}
                    animate={{ opacity: 1, z: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="mb-3 flex flex-col sm:flex-row w-1/2 justify-start items-center gap-2">
                        <div className="relative w-1/2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} strokeWidth={1} />
                            <Input
                                type="text"
                                placeholder="search reports"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                        <Select value={shiftFilter} onValueChange={handleShiftFilterChange}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by shift" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Day">Day</SelectItem>
                                <SelectItem value="Night">Night</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </motion.div>
            </motion.div>
        )
    }

    const TableHeading = () => {
        return (
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">
                        <span className="uppercase text-xs">Report Name</span>
                    </TableHead>
                    <TableHead
                        className="text-center cursor-pointer"
                        onClick={() => handleSort('date')}>
                        <div className="flex items-center justify-center">
                            <span className="uppercase text-xs">Date</span>
                            {sortConfig.key === 'date' && (
                                sortConfig.direction === 'asc' ? (
                                    <ArrowUp className="h-4 w-4 inline-block ml-1" />
                                ) : (
                                    <ArrowDown className="h-4 w-4 inline-block ml-1" />
                                )
                            )}
                            <span className="sr-only">
                                {sortConfig.key === 'date'
                                    ? sortConfig.direction === 'asc'
                                        ? '(sorted ascending)'
                                        : '(sorted descending)'
                                    : '(not sorted)'}
                            </span>
                        </div>
                    </TableHead>
                    <TableHead className="text-center">
                        <span className="uppercase text-xs">Shift</span>
                    </TableHead>
                    <TableHead className="text-center">
                        <span className="uppercase text-xs">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
        )
    }

    const TableContent = () => {
        return (
            <>
                {
                    currentReports.map((report) => (
                        <TableRow key={report?.uid}>
                            <TableCell className="font-medium text-center">{report?.reportTitle}</TableCell>
                            <TableCell className="text-center">{report?.reportCreationDate?.slice(0, 10)}</TableCell>
                            <TableCell className="text-center">{report?.shift}</TableCell>
                            <TableCell>
                                <div className="flex justify-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(`${process.env.NEXT_PUBLIC_API_URL_FILE_ENDPOINT}${report?.fileName}`)}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </>
        )
    }

    return (
        <div className="w-full">
            <PageHeader />
            <div className="bg-white rounded border overflow-hidden mb-6">
                <Table>
                    <TableHeading />
                    <TableBody>
                        <TableContent />
                    </TableBody>
                </Table>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mt-2">
                <motion.div
                    initial={{ opacity: 0, z: -20 }}
                    animate={{ opacity: 1, z: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="5 items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 items per page</SelectItem>
                            <SelectItem value="10">10 items per page</SelectItem>
                            <SelectItem value="20">20 items per page</SelectItem>
                        </SelectContent>
                    </Select>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, z: 20 }}
                    animate={{ opacity: 1, z: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 pr-2">
                        <ChevronLeft
                            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                        <span className="text-sm text-gray-700">
                            {currentPage} of {totalPages}
                        </span>
                        <ChevronRight
                            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                    </div>
                </motion.div>
            </motion.div>
        </div >
    )
}
