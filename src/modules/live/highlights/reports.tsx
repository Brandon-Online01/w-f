import { useEffect, useState } from 'react'
import { latestReports } from '@/data/data'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownToLine, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

type HighlightReport = {
    uid: number,
    fileName: string,
    creationDate: string,
    reportURL: string
    shift: string
}

type Report = {
    uid: number,
    title: string,
    date: string,
    url: string,
    shift: string
}

export default function ProductionReportCard() {
    const [downloadingId, setDownloadingId] = useState<number | null>(null)
    const [reports, setReports] = useState<Report[]>([])

    useEffect(() => {
        const getReports = async () => {
            const reports = await latestReports()

            const reportsList = reports?.data?.map((report: HighlightReport) => ({
                uid: report?.uid,
                title: report?.fileName,
                date: report?.creationDate,
                url: report?.reportURL,
                shift: report?.shift
            }))

            setReports(reportsList)
        }

        getReports()
    }, [])

    const handleDownload = (uid: number, url: string) => {
        setDownloadingId(uid)
        // Simulating download delay
        setTimeout(() => {
            window.open(url, '_blank')
            setDownloadingId(null)
        }, 1000)
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="items-center pb-0">
                <CardDescription>
                    <p className="text-sm text-card-foreground -mt-3 uppercase">Production Reports</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="pr-4">
                    {reports.map((report) => (
                        <div key={report?.uid} className="flex items-center justify-between py-4 border-b last:border-b-0">
                            <div className="flex items-center space-x-4">
                                <FileText className="h-6 w-6 text-gray-400" />
                                <div>
                                    <h3 className="text-sm font-medium">{report?.title}</h3>
                                    <p className="text-sm text-gray-500">{report?.date?.slice(0, 10)} • {report?.shift}</p>
                                </div>
                            </div>
                            <Button
                                className="h-8 w-8"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(report?.uid, report?.url)}
                                disabled={downloadingId === report?.uid}>
                                {downloadingId === report?.uid ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                    <ArrowDownToLine className="h-4 w-4" />
                                )}
                                <span className="sr-only">Download report</span>
                            </Button>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}