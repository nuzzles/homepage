import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ClaudeBehavior, type ClaudeExpression } from "./claudeBehavior"

const expressions: ClaudeExpression[] = ["neutral", "up", "right", "down", "left", "dizzy", "sleeping", "happy"]

export const ClaudeMascot = () => {
    const { t } = useTranslation()
    const button = useRef<HTMLButtonElement>(null)
    const [expression, setExpression] = useState<ClaudeExpression>("neutral")

    useEffect(() => {
        const target = button.current
        const footer = target?.closest("footer")
        if (!target || !footer) return
        const behavior = new ClaudeBehavior(Date.now())
        let timer: ReturnType<typeof setTimeout> | undefined
        // Warm the tiny local assets so the first reaction does not flash blank.
        expressions.forEach((name) => {
            const image = new Image()
            image.src = `/images/claude/${name}.svg`
        })
        const refresh = () => {
            clearTimeout(timer)
            const now = Date.now()
            setExpression(behavior.state(now))
            const next = behavior.nextChange(now)
            if (next !== null) timer = setTimeout(refresh, next - now)
        }
        const activity = () => {
            behavior.activity(Date.now())
            refresh()
        }
        const move = (event: PointerEvent) => {
            if (event.pointerType === "touch") return
            const rect = target.getBoundingClientRect()
            behavior.move(
                event.clientX - rect.left - rect.width / 2,
                event.clientY - rect.top - rect.height / 2,
                Date.now()
            )
            refresh()
        }
        const happy = () => {
            behavior.happy(Date.now())
            refresh()
        }
        const leave = () => {
            behavior.leave(Date.now())
            refresh()
        }
        footer.addEventListener("pointermove", move, { passive: true })
        footer.addEventListener("pointerleave", leave)
        window.addEventListener("pointerdown", activity, { passive: true })
        window.addEventListener("keydown", activity)
        window.addEventListener("scroll", activity, { passive: true })
        target.addEventListener("click", happy)
        refresh()
        return () => {
            clearTimeout(timer)
            footer.removeEventListener("pointermove", move)
            footer.removeEventListener("pointerleave", leave)
            window.removeEventListener("pointerdown", activity)
            window.removeEventListener("keydown", activity)
            window.removeEventListener("scroll", activity)
            target.removeEventListener("click", happy)
        }
    }, [])

    return (
        <button
            ref={button}
            type="button"
            className="claude-mascot"
            aria-label={t("footer.claudeHappy")}
            title={t("footer.claudeHappy")}
            data-state={expression}
        >
            <img src={`/images/claude/${expression}.svg`} width="24" height="24" alt="Claude" draggable={false} />
        </button>
    )
}
