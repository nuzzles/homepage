export const PixelCoffee = ({ label }: { label: string }) => (
    <svg
        className="footer-coffee"
        role="img"
        aria-label={label}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        shapeRendering="crispEdges"
    >
        <path d="M3 10h14v12H3zM17 12h4v2h2v5h-2v2h-4v-2h3v-5h-3z" />
        <path className="coffee-steam coffee-steam-left" d="M6 5h2v3H6z" />
        <path className="coffee-steam coffee-steam-center" d="M10 2h2v5h-2z" />
        <path className="coffee-steam coffee-steam-right" d="M14 4h2v4h-2z" />
    </svg>
)
