import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BarChart, type BarSeriesOption } from "echarts/charts"
import {
    GridComponent,
    TooltipComponent,
    type GridComponentOption,
    type TooltipComponentOption,
} from "echarts/components"
import { init, use as registerCharts, type ComposeOption } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"

registerCharts([BarChart, GridComponent, TooltipComponent, SVGRenderer])

type ChartOption = ComposeOption<BarSeriesOption | GridComponentOption | TooltipComponentOption>
type Row = { label: string; value: number }
interface ChartData {
    viewport: HTMLElement
    id: string
    title: string
    unit: string
    rows: Row[]
}
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 })

function Chart({ viewport, title, unit, rows }: ChartData) {
    const host = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const element = host.current!
        const styles = getComputedStyle(document.documentElement)
        const token = (name: string) => styles.getPropertyValue(name).trim()
        const font = getComputedStyle(element).fontFamily
        const instance = init(element, null, { renderer: "svg" })
        const foreground = token("--foreground")
        const interval = () => Math.ceil(rows.length / (element.clientWidth < 400 ? 4 : 8)) - 1
        const option: ChartOption = {
            animation: false,
            textStyle: { fontFamily: font, color: foreground },
            grid: { left: 52, right: 16, top: 24, bottom: 62 },
            tooltip: {
                trigger: "axis",
                confine: true,
                transitionDuration: 0,
                className: "stats-chart-tooltip",
                backgroundColor: token("--background"),
                borderColor: foreground,
                borderWidth: 1,
                padding: [12, 16],
                textStyle: { fontFamily: font, fontSize: 16, color: foreground },
                extraCssText: `border-radius:${token("--tooltip-radius")};box-shadow:${token("--shadow-tooltip")};`,
                valueFormatter: (value) => number.format(Number(value)),
                axisPointer: {
                    type: "shadow",
                    animation: false,
                    shadowStyle: { color: foreground, opacity: 0.06 },
                },
            },
            xAxis: {
                type: "category",
                data: rows.map((row) => row.label),
                axisTick: { show: false },
                axisLine: { lineStyle: { color: token("--border-color") } },
                axisLabel: {
                    interval: interval(),
                    hideOverlap: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    fontSize: 12,
                    margin: 16,
                    formatter: (label: string) => label.replace(/^(\w{3})\w+ (\d{4})$/, "$1\n$2"),
                },
            },
            yAxis: {
                type: "value",
                min: 0,
                minInterval: unit === "posts" ? 1 : undefined,
                splitNumber: 4,
                axisLabel: { formatter: (value: number) => number.format(value), fontSize: 12 },
                splitLine: { lineStyle: { color: token("--border-color") } },
            },
            series: [
                {
                    type: "bar",
                    name: unit,
                    data: rows.map((row) => row.value),
                    barMaxWidth: 70,
                    itemStyle: { color: token("--accent-yellow") },
                    emphasis: { itemStyle: { color: foreground } },
                },
            ],
        }
        instance.setOption(option)
        viewport.setAttribute("data-enhanced", "true")
        const resize = new ResizeObserver(() => {
            instance.resize()
            instance.setOption({ xAxis: { axisLabel: { interval: interval() } } })
        })
        resize.observe(element)
        const dismiss = () => {
            instance.dispatchAction({ type: "hideTip" })
            instance.dispatchAction({ type: "updateAxisPointer", currTrigger: "leave" })
            instance.dispatchAction({ type: "downplay", seriesIndex: 0 })
        }
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") dismiss()
        }
        const outside = (event: PointerEvent) => {
            if (event.target instanceof Node && !viewport.contains(event.target)) dismiss()
        }
        document.addEventListener("keydown", escape)
        document.addEventListener("pointerdown", outside)
        void document.fonts.ready.then(() => {
            if (!instance.isDisposed()) instance.resize()
        })
        return () => {
            resize.disconnect()
            document.removeEventListener("keydown", escape)
            document.removeEventListener("pointerdown", outside)
            viewport.removeAttribute("data-enhanced")
            instance.dispose()
        }
    }, [viewport, rows, unit])
    return (
        <div className="stats-chart-enhancement">
            <div
                ref={host}
                className="stats-library-chart"
                role="img"
                aria-label={`${title}. Exact values in the data table below.`}
            />
        </div>
    )
}

/** Progressively enhances Hugo's charts; the static plots and tables remain the fallback. */
export default function StatsCharts() {
    const [charts] = useState(() =>
        [...document.querySelectorAll<HTMLElement>(".stats-chart")].flatMap((section) => {
            const viewport = section.querySelector<HTMLElement>(".stats-chart-viewport")
            const heading = section.querySelector("h2")
            const unit = section.querySelector("thead th:last-child")?.textContent?.toLowerCase()
            const rows = [...section.querySelectorAll<HTMLElement>("tbody tr")].map((row) => ({
                label: row.dataset.period ?? "",
                value: Number(row.dataset.value),
            }))
            if (
                !viewport ||
                !heading ||
                !unit ||
                !rows.length ||
                rows.some((row) => !row.label || !Number.isFinite(row.value))
            )
                return []
            return [
                {
                    viewport,
                    id: heading.id,
                    title: heading.querySelector(".marker-underline")?.textContent ?? heading.textContent ?? "",
                    unit,
                    rows,
                },
            ]
        })
    )
    return <>{charts.map((data) => createPortal(<Chart {...data} />, data.viewport, data.id))}</>
}
