export type ClaudeExpression = "neutral" | "up" | "right" | "down" | "left" | "dizzy" | "sleeping" | "happy"

export const CLAUDE_IDLE_MS = 8000

/** Small event-driven state machine; coordinates are relative to the mascot. */
export class ClaudeBehavior {
    private lastActivity: number
    private gaze: ClaudeExpression = "neutral"
    private reaction: ClaudeExpression = "neutral"
    private reactionUntil = 0
    private previous: { angle: number; time: number } | null = null
    private turn = 0
    private turnStarted = 0

    constructor(now: number) {
        this.lastActivity = now
    }

    activity(now: number) {
        this.lastActivity = now
    }

    happy(now: number) {
        this.activity(now)
        this.reaction = "happy"
        this.reactionUntil = now + 2000
        this.stopTracking()
    }

    move(x: number, y: number, now: number) {
        this.activity(now)
        this.gaze = Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up"
        const radius = Math.hypot(x, y)
        if (radius < 24 || radius > 180 || now < this.reactionUntil) {
            this.stopTracking()
            return
        }
        const angle = Math.atan2(y, x)
        if (!this.previous || now - this.previous.time > 350 || now - this.turnStarted > 2400) {
            this.turn = 0
            this.turnStarted = now
        } else {
            const difference = angle - this.previous.angle
            const delta = Math.atan2(Math.sin(difference), Math.cos(difference))
            // Ignore teleports across the mascot and restart when the orbit reverses.
            if (Math.abs(delta) > Math.PI / 2 || (Math.abs(delta) > 0.08 && delta * this.turn < 0)) {
                this.turn = 0
                this.turnStarted = now
            } else {
                this.turn += delta
            }
            if (Math.abs(this.turn) >= Math.PI * 4 - 0.01) {
                this.reaction = "dizzy"
                this.reactionUntil = now + 2500
                this.stopTracking()
                return
            }
        }
        this.previous = { angle, time: now }
    }

    state(now: number): ClaudeExpression {
        if (now < this.reactionUntil) return this.reaction
        if (now - this.lastActivity >= CLAUDE_IDLE_MS) return "sleeping"
        return this.gaze
    }

    nextChange(now: number) {
        if (now < this.reactionUntil) return this.reactionUntil
        if (now - this.lastActivity < CLAUDE_IDLE_MS) return this.lastActivity + CLAUDE_IDLE_MS
        return null
    }

    stopTracking() {
        this.previous = null
        this.turn = 0
    }
}
