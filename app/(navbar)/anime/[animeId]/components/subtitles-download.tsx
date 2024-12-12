import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"

import { useSocketContext } from "@/lib/subtitle-lib"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SubtitlesDownloadProps {
  selectedEpisodes: number[]
  groupName: string
  animeId: number
}

type Status = { current: number; count: number; animeId: number }

export function SubtitlesDownload({
  selectedEpisodes,
  groupName,
  animeId,
}: SubtitlesDownloadProps) {
  const [simpName, addOnMessage] = useSocketContext()
  const [downloading, setDownloading] = useState(false)
  const [status, setStatus] = useState<Status | null>()
  const toastId = useRef<string | number>(null)

  const onClick = () => {
    toastId.current = toast("Przygotowywanie plików do pobrania")
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(true), 999999)
      }),
      {
        loading: "Przygotowywanie plików do pobrania...",
        id: toastId.current,
      }
    )
  }

  useEffect(() => {
    if (!status || !toastId.current) return

    if (status.current === status.count) {
      toast.success("Przygotowano wszystkie pliki do pobrania", {
        id: toastId.current,
      })

      setDownloading(false)

      return
    }

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(true), 999999)
      }),
      {
        loading: `Przygotowano ${status.current}/${status.count} plików do pobrania`,
        id: toastId.current,
      }
    )
  }, [status, toastId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="aspect-square p-0">
                  {/* Pobierz{" "}
              {selectedEpisodes.length > 0
                ? "wybrane"
                : "wszystkie"} */}
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  Pobierz{" "}
                  {selectedEpisodes.length > 0 ? "wybrane" : "wszystkie"} pliki
                  z napisami
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {downloading ? (
          <>
            <DialogHeader>
              <DialogTitle>Przygotowywanie plików do pobrania</DialogTitle>
            </DialogHeader>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Pobierz pliki</DialogTitle>
              <DialogDescription>
                Wybierz poniżej pliki do pobrania.
              </DialogDescription>
            </DialogHeader>
            <a
              className={buttonVariants({ variant: "default" })}
              href={`/api/v1/fansub/subtitles?groupName=${groupName}&animeId=${animeId}&simpName=${simpName}&episodesNum=${selectedEpisodes.join(",")}`}
              onClick={() => {
                onClick()
                setDownloading(true)
                addOnMessage(setStatus)
              }}
              download
            >
              Pobierz pliki z napisami
            </a>
          </>
        )}
        <iframe className="hidden" name="magnet" />
        {/* <Button onClick={downloadMagnets}>
      Pobierz torrenty
    </Button> */}
        {/* <Button disabled>Pobierz czcionki</Button> */}
      </DialogContent>
    </Dialog>
  )
}
