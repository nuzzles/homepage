import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Shared interaction target for social links, internal navigation, and the email dialog. */
export const SocialBarAction = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant" | "size">>(
    ({ className, ...props }, ref) => (
        <Button ref={ref} variant="ghost" className={cn("social-bar-action", className)} {...props} />
    )
)
SocialBarAction.displayName = "SocialBarAction"
