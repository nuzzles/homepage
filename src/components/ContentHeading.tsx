import { Children, isValidElement, type ReactNode } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { MarkerUnderline } from "./MarkerUnderline"

const headingText = (children: ReactNode): string =>
    Children.toArray(children)
        .map((child) =>
            isValidElement<{ children?: ReactNode }>(child) ? headingText(child.props.children) : String(child)
        )
        .join("")

export const ContentHeading = ({
    level = 2,
    id,
    anchorId = id,
    children,
}: {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    id?: string
    anchorId?: string
    children?: ReactNode
}) => {
    const { t } = useLanguage()
    const Tag = `h${level}` as const
    return (
        <Tag id={id} className="content-heading">
            <span className="heading-title">
                <MarkerUnderline>{children}</MarkerUnderline>
            </span>{" "}
            <a
                className="heading-anchor"
                href={`#${encodeURIComponent(anchorId ?? "")}`}
                aria-label={t("heading.permalink", { heading: headingText(children) })}
            >
                <span aria-hidden="true">#</span>
            </a>
        </Tag>
    )
}
