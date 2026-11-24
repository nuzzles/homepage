import { Button } from "@/components/ui/button"

export const ContentsHeader = ({
    labels,
    controlsId,
    expanded = true,
    onToggle,
}: {
    labels: { title: string; collapse: string; expand: string }
    controlsId: string
    expanded?: boolean
    onToggle?: () => void
}) => (
    <div className="contents-heading">
        <p>{labels.title}</p>
        <Button
            variant="ghost"
            size="icon"
            aria-expanded={expanded}
            aria-controls={controlsId}
            aria-label={expanded ? labels.collapse : labels.expand}
            data-collapse-label={labels.collapse}
            data-expand-label={labels.expand}
            onClick={onToggle}
        >
            <span aria-hidden="true">{expanded ? "[−]" : "[+]"}</span>
        </Button>
    </div>
)
