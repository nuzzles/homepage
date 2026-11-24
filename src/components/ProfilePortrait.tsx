import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { PROFILE_HERO_IMAGE_SIZES } from "@/profiles"
export const ProfilePortrait = () => {
    const profile = useProfile()
    const { t } = useLanguage()
    return (
        <figure className="portrait playful-portrait">
            <div className="portrait-shadow" aria-hidden="true" />
            <div className="portrait-photo">
                <img
                    alt={profile.fullName}
                    src={profile.image}
                    srcSet={profile.imageSrcSet}
                    sizes={PROFILE_HERO_IMAGE_SIZES}
                    fetchPriority="high"
                    loading="eager"
                />
            </div>
            <svg className="portrait-spark" aria-hidden="true" viewBox="0 0 100 100">
                <path d="M50 4 57 34 86 18 69 45 98 53 67 60 82 86 55 71 47 99 40 68 12 84 28 56 2 48 33 41 18 14 44 30Z" />
            </svg>
            <svg className="portrait-scribble" aria-hidden="true" viewBox="0 0 150 60">
                <path d="M5 42C45 5 105 12 133 23S114 60 68 43 17 37 25 24 96 2 145 8" />
            </svg>
            <figcaption>{t(profile.stickerKey)}</figcaption>
        </figure>
    )
}
