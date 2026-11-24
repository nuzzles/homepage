import { useProfile } from "@/hooks/useProfile"
import { PROFILE_HERO_IMAGE_SIZES } from "@/profiles"
export const ProfilePortrait = () => {
    const profile = useProfile()
    return (
        <figure className="profile-portrait">
            <svg className="portrait-hatching" aria-hidden="true" width="100" height="96" viewBox="0 0 100 96">
                <path d="M4 26q8-12 21-21" />
                <path d="M5 41q14-18 35-34" />
                <path d="M3 57q13-10 25-24T58 4" />
                <path d="M5 72q15-18 34-33T73 6" />
                <path d="M4 87q26-29 45-44T89 5" />
                <path d="M14 94q21-18 39-39T96 13" />
                <path d="M30 91q14-17 30-29T97 30" />
                <path d="M44 94q14-10 23-23T94 44" />
                <path d="M61 91q9-12 17-18t19-15" />
                <path d="M76 93q13-13 19-18" />
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
                <path d="M13 29q-5-6-9-10l15-3q2-7 6-12 2 8 5 14 7 0 14 4-7 3-12 7 2 8 1 15-5-6-11-10-5 3-13 5 3-7 4-13" />
                <path className="portrait-pencil-trace" d="m7 19 10-2M26 8l3 12 11 2M12 36l9-4 10 8" />
            </svg>
            <svg
                className="portrait-spark portrait-spark-small"
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
            >
                <path d="M8 15q-2-3-5-4l6-2q1-3 4-6l2 7 7 3q-4 2-7 2-1 4-4 7l-2-8" />
            </svg>
        </figure>
    )
}
