const MAX_OUTPUT = 8 * 1024 * 1024
const ROWS = 16
const $ = (id) => document.getElementById(id)
const narrow = matchMedia("(max-width: 620px)")
const state = {
    original: new Uint8Array(),
    decoded: null,
    view: "original",
    page: 0,
    selected: 0,
    columns: narrow.matches ? 8 : 16,
    zlib: false,
    busy: false,
    request: 0,
}
let lastContent

function hex(value, width = 2) {
    return value.toString(16).toUpperCase().padStart(width, "0")
}

function ascii(value) {
    return value >= 32 && value <= 126 ? String.fromCharCode(value) : "·"
}

function hasZlibHeader(bytes) {
    return bytes.length >= 2 && (bytes[0] & 15) === 8 && bytes[0] >> 4 <= 7 && ((bytes[0] << 8) + bytes[1]) % 31 === 0
}

function showError(message = "") {
    $("error").textContent = message
    $("error").hidden = !message
}

function bytes() {
    return state.view === "decoded" ? state.decoded : state.original
}

function selectByte(offset, focus = false) {
    const data = bytes()
    if (!data.length) return
    state.selected = Math.max(0, Math.min(offset, data.length - 1))
    document.querySelectorAll("[data-offset]").forEach((cell) => {
        const selected = Number(cell.dataset.offset) === state.selected
        cell.classList.toggle("is-selected", selected)
        if (cell.tagName === "BUTTON") cell.tabIndex = selected ? 0 : -1
    })
    const value = data[state.selected]
    const text = value >= 32 && value <= 126 ? JSON.stringify(String.fromCharCode(value)) : "non-printable"
    $("selection").textContent =
        `0x${hex(state.selected, 6)} · hex ${hex(value)} · decimal ${value} · ${value.toString(2).padStart(8, "0")} · ${text}`
    if (focus) $("byte-rows").querySelector(`button[data-offset="${state.selected}"]`)?.focus()
}

function render() {
    const data = bytes()
    const pageSize = ROWS * state.columns
    state.page = Math.max(0, Math.min(state.page, Math.max(0, Math.ceil(data.length / pageSize) - 1)))
    const start = state.page * pageSize
    const end = Math.min(start + pageSize, data.length)
    document.documentElement.style.setProperty("--columns", state.columns)
    $("hex-heading").replaceChildren(
        ...Array.from({ length: state.columns }, (_, i) => {
            const span = document.createElement("span")
            span.textContent = hex(i, 1)
            return span
        })
    )
    const fragment = document.createDocumentFragment()
    for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
        const offset = start + rowIndex * state.columns
        const row = document.createElement("tr")
        const address = document.createElement("td")
        address.textContent = offset < end ? hex(offset, 6) : ""
        const hexCell = document.createElement("td")
        const textCell = document.createElement("td")
        const hexBytes = document.createElement("div")
        const textBytes = document.createElement("div")
        hexBytes.className = "hex-bytes"
        textBytes.className = "text-bytes"
        for (let i = offset; i < Math.min(offset + state.columns, end); i++) {
            const button = document.createElement("button")
            button.type = "button"
            button.className = "hex-byte"
            button.dataset.offset = String(i)
            button.textContent = hex(data[i])
            button.setAttribute("aria-label", `Offset ${hex(i, 6)}, hex ${hex(data[i])}, decimal ${data[i]}`)
            button.tabIndex = -1
            const text = document.createElement("span")
            text.className = "text-byte"
            text.dataset.offset = String(i)
            text.textContent = ascii(data[i])
            if (state.view === "original" && state.zlib && i < 2) {
                button.classList.add("is-header")
                text.classList.add("is-header")
            }
            hexBytes.append(button)
            textBytes.append(text)
        }
        hexCell.append(hexBytes)
        textCell.append(textBytes)
        row.append(address, hexCell, textCell)
        fragment.append(row)
    }
    $("byte-rows").replaceChildren(fragment)
    $("byte-count").textContent = `${data.length.toLocaleString("en-US")} bytes`
    $("range").textContent = data.length
        ? `${hex(start, 6)}–${hex(end - 1, 6)} / ${Math.ceil(data.length / pageSize)} pages`
        : "No bytes loaded"
    $("previous").disabled = start === 0
    $("next").disabled = end === data.length
    for (const [id, active] of [
        ["compressed-tab", state.view === "original"],
        ["decoded-tab", state.view === "decoded"],
    ]) {
        $(id).setAttribute("aria-selected", String(active))
        $(id).tabIndex = active ? 0 : -1
    }
    $("compressed-tab").textContent = state.zlib ? "Compressed" : "Original"
    document.querySelector(".tabs").hidden = !state.zlib
    $("decoded-tab").disabled = !state.zlib || state.busy
    $("byte-view").setAttribute(
        "aria-labelledby",
        state.zlib ? (state.view === "original" ? "compressed-tab" : "decoded-tab") : "viewer-title"
    )
    $("byte-view").setAttribute("aria-busy", String(state.busy))
    if (data.length) {
        if (state.selected < start || state.selected >= end) state.selected = start
        selectByte(state.selected)
    } else {
        $("selection").textContent = "No bytes to inspect."
    }
}

async function inflate(data) {
    const reader = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate")).getReader()
    const parts = []
    let length = 0
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            length += value.length
            if (length > MAX_OUTPUT) {
                await reader.cancel()
                throw new Error("Decompressed data exceeds the 8 MiB limit.")
            }
            parts.push(value)
        }
    } finally {
        reader.releaseLock()
    }
    const result = new Uint8Array(length)
    let offset = 0
    for (const part of parts) {
        result.set(part, offset)
        offset += part.length
    }
    return result
}

async function changeView(view) {
    if (view === "decoded" && (!state.zlib || state.busy)) return
    showError()
    const request = ++state.request
    if (view === "decoded" && state.decoded === null) {
        state.busy = true
        render()
        $("selection").textContent = "Decompressing in your browser."
        try {
            if (!("DecompressionStream" in window)) {
                throw new Error("This browser cannot decompress zlib. The original bytes remain available.")
            }
            const result = await inflate(state.original)
            if (request !== state.request) return
            state.decoded = result
        } catch (error) {
            if (request !== state.request) return
            state.busy = false
            render()
            showError(
                error instanceof TypeError ? "The supplied bytes could not be decompressed as zlib." : error.message
            )
            return
        }
    }
    if (request !== state.request) return
    state.busy = false
    state.view = view
    state.page = 0
    state.selected = 0
    render()
}

function loadBytes(data, name) {
    ++state.request
    Object.assign(state, {
        original: data,
        decoded: null,
        view: "original",
        page: 0,
        selected: 0,
        zlib: hasZlibHeader(data),
        busy: false,
    })
    $("viewer-title").textContent = name || "Hex / text"
    document.title = name || "Hex / text"
    showError()
    render()
}

function parseHex(text) {
    const clean = text.replace(/\s+/g, "")
    if (clean.length % 2 || !/^[0-9a-f]*$/i.test(clean)) {
        throw new Error("Supply text as hexadecimal byte pairs, such as 48 65 6C 6C 6F.")
    }
    const result = new Uint8Array(clean.length / 2)
    for (let i = 0; i < result.length; i++) result[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
    return result
}

window.addEventListener("message", (event) => {
    if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.type !== "hex-viewer:content"
    )
        return
    const { text, title } = event.data
    if (typeof text !== "string" || typeof title !== "string") return
    const content = JSON.stringify([text, title])
    if (content === lastContent) return
    lastContent = content
    try {
        loadBytes(parseHex(text), title)
    } catch (error) {
        loadBytes(new Uint8Array(), title)
        showError(error.message)
    }
})

$("compressed-tab").addEventListener("click", () => changeView("original"))
$("decoded-tab").addEventListener("click", () => changeView("decoded"))
document.querySelector(".tabs").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const tab =
        event.key === "Home"
            ? $("compressed-tab")
            : event.key === "End"
              ? $("decoded-tab")
              : state.view === "original"
                ? $("decoded-tab")
                : $("compressed-tab")
    if (!tab.disabled) {
        tab.focus()
        tab.click()
    }
})
for (const [id, delta] of [
    ["previous", -1],
    ["next", 1],
]) {
    $(id).addEventListener("click", () => {
        state.page += delta
        state.selected = state.page * ROWS * state.columns
        render()
    })
}
$("byte-rows").addEventListener("click", (event) => {
    const cell = event.target.closest("[data-offset]")
    if (cell) selectByte(Number(cell.dataset.offset))
})
$("byte-rows").addEventListener("pointerover", (event) => {
    const cell = event.target.closest("[data-offset]")
    document.querySelectorAll(".is-hovered").forEach((item) => item.classList.remove("is-hovered"))
    if (cell)
        $("byte-rows")
            .querySelectorAll(`[data-offset="${cell.dataset.offset}"]`)
            .forEach((item) => item.classList.add("is-hovered"))
})
$("byte-rows").addEventListener("pointerleave", () =>
    document.querySelectorAll(".is-hovered").forEach((item) => item.classList.remove("is-hovered"))
)
$("byte-rows").addEventListener("keydown", (event) => {
    const offset = Number(event.target.dataset.offset)
    if (!Number.isFinite(offset)) return
    const pageSize = ROWS * state.columns
    const moves = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -state.columns,
        ArrowDown: state.columns,
        PageUp: -pageSize,
        PageDown: pageSize,
    }
    let target
    if (event.key in moves) target = offset + moves[event.key]
    else if (event.key === "Home") target = event.ctrlKey ? 0 : offset - (offset % state.columns)
    else if (event.key === "End")
        target = event.ctrlKey ? bytes().length - 1 : offset - (offset % state.columns) + state.columns - 1
    else return
    event.preventDefault()
    state.selected = Math.max(0, Math.min(target, bytes().length - 1))
    const page = Math.floor(state.selected / pageSize)
    if (page !== state.page) {
        state.page = page
        render()
    }
    selectByte(state.selected, true)
})
narrow.addEventListener("change", () => {
    state.columns = narrow.matches ? 8 : 16
    state.page = Math.floor(state.selected / (ROWS * state.columns))
    render()
})
render()
if (window.parent !== window) {
    const sendHeight = () =>
        window.parent.postMessage(
            { type: "hex-viewer:resize", height: document.querySelector("main").getBoundingClientRect().height + 2 },
            window.location.origin
        )
    new ResizeObserver(sendHeight).observe(document.querySelector("main"))
    sendHeight()
    window.parent.postMessage({ type: "hex-viewer:ready" }, window.location.origin)
}
