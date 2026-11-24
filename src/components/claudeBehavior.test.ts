import { describe, expect, it } from "vitest"
import { ClaudeBehavior, CLAUDE_IDLE_MS } from "./claudeBehavior"

describe("Claude reactions", () => {
    it.each([
        [100, 0, "right"],
        [-100, 0, "left"],
        [0, -100, "up"],
        [0, 100, "down"],
    ] as const)("looks toward (%s, %s)", (x, y, expression) => {
        const behavior = new ClaudeBehavior(0)
        behavior.move(x, y, 100)
        expect(behavior.state(100)).toBe(expression)
    })

    it.each([1, -1])("gets dizzy only after two quick nearby orbits in direction %s", (direction) => {
        const behavior = new ClaudeBehavior(0)
        for (let i = 0; i <= 48; i++) {
            const angle = (direction * i * Math.PI) / 12
            behavior.move(Math.cos(angle) * 80, Math.sin(angle) * 80, i * 40)
            if (i < 48) expect(behavior.state(i * 40)).not.toBe("dizzy")
        }
        expect(behavior.state(2000)).toBe("dizzy")
        expect(behavior.state(5000)).toBe("right")
    })

    it("does not get dizzy from distant circles, slow circles, or back-and-forth motion", () => {
        for (const scenario of ["distant", "slow", "reversing"]) {
            const behavior = new ClaudeBehavior(0)
            for (let i = 0; i <= 48; i++) {
                const angle = scenario === "reversing" ? (i % 2) * 0.5 : (i * Math.PI) / 12
                const radius = scenario === "distant" ? 500 : 80
                behavior.move(Math.cos(angle) * radius, Math.sin(angle) * radius, i * (scenario === "slow" ? 500 : 60))
            }
            expect(behavior.state(scenario === "slow" ? 24000 : 2880)).not.toBe("dizzy")
        }
    })

    it("sleeps on idle and wakes with pointer or keyboard activity", () => {
        const behavior = new ClaudeBehavior(0)
        expect(behavior.nextChange(0)).toBe(CLAUDE_IDLE_MS)
        expect(behavior.state(CLAUDE_IDLE_MS)).toBe("sleeping")
        expect(behavior.nextChange(CLAUDE_IDLE_MS)).toBeNull()
        behavior.activity(9000)
        expect(behavior.state(9000)).toBe("neutral")
        behavior.move(-80, 0, 10000)
        expect(behavior.state(10000)).toBe("left")
    })

    it("keeps click happiness through pointer movement, then resumes looking", () => {
        const behavior = new ClaudeBehavior(0)
        behavior.happy(100)
        behavior.move(100, 0, 200)
        expect(behavior.state(200)).toBe("happy")
        expect(behavior.nextChange(200)).toBe(2100)
        expect(behavior.state(2100)).toBe("right")
        expect(behavior.state(8200)).toBe("sleeping")
    })
})
