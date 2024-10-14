"use client"

import { useState } from "react"
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
import { ChevronLeft, ChevronRight, Download, Eye, Search, ArrowUp, ArrowDown } from "lucide-react"

// Mock data for reports
const initialReports = [
    { id: 1, name: "Q1 Financial Report", date: "2023-04-01", shift: "Night", pdfUrl: "/reports/q1-financial-report.pdf" },
    { id: 2, name: "User Engagement Analysis", date: "2023-05-15", shift: "Day", pdfUrl: "/reports/user-engagement-analysis.pdf" },
    { id: 3, name: "Product Performance Review", date: "2023-06-30", shift: "Day", pdfUrl: "/reports/product-performance-review.pdf" },
    { id: 4, name: "Annual Sales Summary", date: "2023-12-31", shift: "Morning", pdfUrl: "/reports/annual-sales-summary.pdf" },
    { id: 5, name: "Customer Satisfaction Survey", date: "2024-01-15", shift: "Night", pdfUrl: "/reports/customer-satisfaction-survey.pdf" },
    { id: 6, name: "Market Trend Analysis", date: "2024-02-28", shift: "Day", pdfUrl: "/reports/market-trend-analysis.pdf" },
    { id: 7, name: "Operational Efficiency Report", date: "2024-03-15", shift: "Night", pdfUrl: "/reports/operational-efficiency-report.pdf" },
    { id: 8, name: "Employee Satisfaction Survey", date: "2024-04-30", shift: "Night", pdfUrl: "/reports/employee-satisfaction-survey.pdf" },
    { id: 9, name: "Quarterly Budget Review", date: "2024-05-31", shift: "Night", pdfUrl: "/reports/quarterly-budget-review.pdf" },
    { id: 10, name: "Social Media Impact Analysis", date: "2024-06-15", shift: "Night", pdfUrl: "/reports/social-media-impact-analysis.pdf" },
    { id: 11, name: "Supply Chain Optimization Study", date: "2024-07-31", shift: "Day", pdfUrl: "/reports/supply-chain-optimization-study.pdf" },
    { id: 12, name: "Customer Retention Strategy", date: "2024-08-15", shift: "Night", pdfUrl: "/reports/customer-retention-strategy.pdf" },
]

export default function ReportsManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [reports] = useState(initialReports)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [shiftFilter, setShiftFilter] = useState("All")
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })

    const filteredReports = reports.filter((report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (shiftFilter === "All" || report.shift === shiftFilter)
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

    const handleView = (pdfUrl: string) => {
        window.open(pdfUrl, '_blank')
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

    return (
        <div className="w-full">
            <div className="mb-3 flex flex-col sm:flex-row w-1/2 justify-start items-center gap-2">
                <div className="relative w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} strokeWidth={1} />
                    <Input
                        type="text"
                        placeholder="Search reports..."
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
            <div className="bg-white rounded border overflow-hidden mb-6">
                <Table>
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
                    <TableBody>
                        {currentReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium text-center">{report.name}</TableCell>
                                <TableCell className="text-center">{report.date}</TableCell>
                                <TableCell className="text-center">{report.shift}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(report.pdfUrl)}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(report.pdfUrl)}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
                <div className="flex items-center space-x-2">
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
            </div>
        </div>
    )
}
