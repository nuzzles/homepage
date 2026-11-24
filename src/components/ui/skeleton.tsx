import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("animate-pulse bg-accent motion-reduce:animate-none", className)} {...props} />
)
