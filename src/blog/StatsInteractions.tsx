import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

const StatsCharts = lazy(() => import("./StatsCharts").catch(() => ({ default: () => <></> })))

type Target = HTMLElement | SVGElement
interface Selection {
    element: Target
    label: string
    value?: string
    links: { title: string; href: string }[]
    activated: boolean
}

/** Enhances Hugo's static charts with the site's shared accessible popover. */
export function StatsInteractions() {
    const [hasCharts] = useState(() => Boolean(document.querySelector(".stats-chart")))
    const [selection, setSelection] = useState<Selection | null>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const dismissed = useRef<Target | null>(null)
    const cancelClose = useCallback(() => clearTimeout(timer.current), [])
    const scheduleClose = useCallback(() => {
        cancelClose()
        timer.current = setTimeout(() => {
            if (contentRef.current?.contains(document.activeElement)) return
            if (document.activeElement?.matches("[data-stats-popup]")) return
            setSelection(null)
        }, 250)
    }, [cancelClose])
    const dismiss = () => {
        cancelClose()
        if (selection) {
            dismissed.current = selection.element
            selection.element.focus({ preventScroll: true })
        }
        setSelection(null)
    }
    useEffect(() => {
        const cleanup: (() => void)[] = []
        for (const element of document.querySelectorAll<Target>("[data-stats-popup]")) {
            const show = (activated = false) => {
                cancelClose()
                if (!activated && dismissed.current === element) return
                dismissed.current = null
                const template = document.getElementById(element.dataset.statsPopup ?? "")
                const fragment = template instanceof HTMLTemplateElement ? template.content : null
                setSelection({
                    element,
                    label: fragment?.querySelector("p")?.textContent ?? element.dataset.popupLabel ?? "",
                    value: element.dataset.popupValue,
                    links: [...(fragment?.querySelectorAll("a") ?? [])].map((link) => ({
                        title: link.textContent ?? "",
                        href: link.href,
                    })),
                    activated,
                })
            }
            const enter = (event: PointerEvent) => {
                if (event.pointerType !== "touch") show()
            }
            const focus = () => show()
            const leave = () => {
                dismissed.current = null
                scheduleClose()
            }
            const click = (event: Event) => {
                event.preventDefault()
                show(true)
            }
            const key = (event: KeyboardEvent) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    show(true)
                }
            }
            element.addEventListener("pointerenter", enter as EventListener)
            element.addEventListener("pointerleave", leave)
            element.addEventListener("focus", focus)
            element.addEventListener("blur", scheduleClose)
            element.addEventListener("click", click)
            element.addEventListener("keydown", key as EventListener)
            cleanup.push(() => {
                element.removeEventListener("pointerenter", enter as EventListener)
                element.removeEventListener("pointerleave", leave)
                element.removeEventListener("focus", focus)
                element.removeEventListener("blur", scheduleClose)
                element.removeEventListener("click", click)
                element.removeEventListener("keydown", key as EventListener)
            })
        }
        return () => {
            cleanup.forEach((dispose) => dispose())
            cancelClose()
        }
    }, [cancelClose, scheduleClose])
    useEffect(() => {
        const element = selection?.element
        if (!element) return
        element.setAttribute("aria-expanded", "true")
        element.setAttribute("aria-controls", "stats-popover")
        return () => {
            element.setAttribute("aria-expanded", "false")
            element.removeAttribute("aria-controls")
        }
    }, [selection])
    // A click/Enter on an already hovered day must still move focus into its links.
    useEffect(() => {
        if (selection?.activated)
            (
                contentRef.current?.querySelector<HTMLElement>("a") ??
                contentRef.current?.querySelector<HTMLElement>("button")
            )?.focus({ preventScroll: true })
    }, [selection])
    return (
        <>
            <Suspense fallback={null}>{hasCharts && <StatsCharts />}</Suspense>
            <Popover
                open={Boolean(selection)}
                onOpenChange={(open) => {
                    if (!open) setSelection(null)
                }}
            >
                {selection && (
                    <PopoverAnchor
                        virtualRef={{
                            current: {
                                getBoundingClientRect: () => {
                                    const bar = selection.element.querySelector(".stats-bar")
                                    const rect = (bar ?? selection.element).getBoundingClientRect()
                                    // Position value details at the bar tip, not outside the full plot.
                                    return bar ? new DOMRect(rect.x, rect.y, rect.width, 0) : rect
                                },
                            },
                        }}
                    />
                )}
                <PopoverContent
                    ref={contentRef}
                    id="stats-popover"
                    className="stats-popover"
                    aria-label={selection?.label}
                    side="top"
                    sideOffset={8}
                    collisionPadding={16}
                    sticky="always"
                    updatePositionStrategy="always"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault()
                        if (selection?.activated)
                            (
                                contentRef.current?.querySelector<HTMLElement>("a") ??
                                contentRef.current?.querySelector<HTMLElement>("button")
                            )?.focus({ preventScroll: true })
                    }}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                    onInteractOutside={(event) => {
                        // The virtual anchor is outside Radix's trigger tree. Keep its
                        // pointer/focus events from immediately dismissing the popup.
                        if (event.target instanceof Element && event.target.closest("[data-stats-popup]"))
                            event.preventDefault()
                    }}
                    onEscapeKeyDown={dismiss}
                    onPointerEnter={cancelClose}
                    onPointerLeave={scheduleClose}
                    onBlur={scheduleClose}
                >
                    <div className="stats-popover-heading">
                        <p>{selection?.label}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="stats-popover-close"
                            aria-label="Close details"
                            onClick={dismiss}
                        >
                            Close
                            <X aria-hidden="true" />
                        </Button>
                    </div>
                    {selection?.value && <strong className="stats-popover-value">{selection.value}</strong>}
                    {Boolean(selection?.links.length) && (
                        <ul>
                            {selection?.links.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href}>{link.title}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </PopoverContent>
            </Popover>
        </>
    )
}
