import { useProfile } from "@/hooks/useProfile"
import { PROFILE_HERO_IMAGE_SIZES } from "@/profiles"
export const ProfilePortrait = () => {
    const profile = useProfile()
    return (
        <figure className="profile-portrait">
            <svg className="portrait-hatching" aria-hidden="true" width="100" height="96" viewBox="0 0 100 96">
                <path d="M5 25 24 6M4 40 41 5M5 55 57 5M5 70 72 5M5 85 87 5M13 92 96 12M29 92 96 28M44 91 95 44M59 92 95 60M76 91 96 76" />
            </svg>
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
            <svg className="portrait-spark" aria-hidden="true" width="44" height="44" viewBox="0 0 48 48">
                <path d="M14 28 5 18q7-1 14-1l5-12 6 13 13 3-11 8 1 14-11-9-13 5 5-12" />
            </svg>
            <svg
                className="portrait-spark portrait-spark-small"
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
            >
                <path d="m8 14-5-4 6-1 4-6 1 7 7 3-7 2-3 6-2-7" />
            </svg>
        </figure>
    )
}
