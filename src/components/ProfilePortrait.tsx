import { useProfile } from "@/hooks/useProfile"
import { PROFILE_HERO_IMAGE_SIZES } from "@/profiles"
export const ProfilePortrait = () => {
    const profile = useProfile()
    return (
        <figure className="profile-portrait">
            <div className="portrait-hatching" aria-hidden="true" />
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
                <path d="m25 4 5 13 14 3-11 9 1 15-11-9-14 5 5-14L4 15l15 1Z" />
            </svg>
            <svg
                className="portrait-spark portrait-spark-small"
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
            >
                <path d="M12 3c0 6-3 9-9 9 6 0 9 3 9 9 0-6 3-9 9-9-6 0-9-3-9-9Z" />
            </svg>
        </figure>
    )
}
