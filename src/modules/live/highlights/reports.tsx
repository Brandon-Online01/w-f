import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownToLine, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { useSessionStore } from '@/providers/session.provider'
import { create } from 'zustand'
import { reportList } from '@/data/reports'

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

type ReportStore = {
    reports: Report[],
    downloadingId: number | null,
    setReports: (reports: Report[]) => void,
    setDownloadingId: (id: number | null) => void
}

const useReportStore = create<ReportStore>((set) => ({
    reports: [],
    downloadingId: null,
    setReports: (reports: Report[]) => set({ reports }),
    setDownloadingId: (id: number | null) => set({ downloadingId: id })
}))

export default function ProductionReportCard() {
    const token = useSessionStore(state => state?.token)
    const { reports, setReports, downloadingId, setDownloadingId } = useReportStore()

    useEffect(() => {
        const getReports = async () => {
            if (token) {
                const reports = await reportList(token)

                const reportsList = reports?.data?.map((report: HighlightReport) => ({
                    uid: report?.uid,
                    title: report?.fileName,
                    date: report?.creationDate,
                    url: report?.reportURL,
                    shift: report?.shift
                }))

                setReports(reportsList)
            }
        }

        getReports()
    }, [token, setReports, setDownloadingId])

    const handleDownload = (referenceID: number, referenceURL: string) => {
        setDownloadingId(referenceID)

        setTimeout(() => {
            window.open(referenceURL, '_blank')
            setDownloadingId(null)
        }, 1000)
    }

    return (
        <Card className="w-full h-[380px] reports">
            <CardHeader className="items-center pb-0">
                <CardDescription>
                    <p className="text-sm text-card-foreground -mt-3 uppercase">Production Reports</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="pr-4">
                    {reports?.map((report) => (
                        <div key={report?.uid} className="flex items-center justify-between py-4 border-b last:border-b-0">
                            <div className="flex items-center space-x-4">
                                <FileText className="stroke-card-foreground w-" strokeWidth={1} size={22} />
                                <div>
                                    <h3 className="text-sm font-medium text-card-foreground">{report?.title}</h3>
                                    <p className="text-sm text-card-foreground">{report?.date?.slice(0, 10)} • {report?.shift}</p>
                                </div>
                            </div>
                            <Button
                                className="h-8 w-8"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(report?.uid, report?.url)}
                                disabled={downloadingId === report?.uid}>
                                {downloadingId === report?.uid ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <ArrowDownToLine className="stroke-card-foreground" strokeWidth={1} size={18} />}
                                <span className="sr-only">Download report</span>
                            </Button>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}