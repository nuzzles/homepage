import { useProfile } from "@/hooks/useProfile"
import { PROFILE_HERO_IMAGE_SIZES } from "@/profiles"
export const ProfilePortrait = () => {
    const profile = useProfile()
    return (
        <figure className="profile-portrait">
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
        </figure>
    )
}
