import { useState, type ReactNode } from "react"
import { Trans } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRust } from "@fortawesome/free-brands-svg-icons"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import type { ProfileId } from "@/profiles"

const AffiliationLink = ({ href, icon, children }: { href: string; icon: ReactNode; children?: ReactNode }) => (
    <a href={href} className="affiliation">
        <span aria-hidden="true" className="affiliation-icon">
            {icon}
        </span>
        {children}
    </a>
)
const affiliationIcon = (name: string) => <img src={`/images/affiliations/${name}.svg`} alt="" />

export const ProfileBiography = ({ expandable = true }: { expandable?: boolean }) => {
    const { t } = useLanguage()
    const profileId = useProfile().id
    const [expandedBiography, setExpandedBiography] = useState<ProfileId | null>(null)
    const biographyExpanded = expandedBiography === profileId
    const hasBiographyDetails = Boolean(t(`home.biographies.${profileId}.details`))
    return (
        <p className="biography">
            <Trans
                t={t}
                i18nKey={`home.biographies.${profileId}.introduction`}
                components={{ uf: <a href="https://www.ufl.edu/" /> }}
            />
            {hasBiographyDetails && (
                <span
                    id="profile-biography-details"
                    className={!expandable || biographyExpanded ? "inline" : "hidden lg:inline"}
                >
                    {" "}
                    <Trans
                        t={t}
                        i18nKey={`home.biographies.${profileId}.details`}
                        components={{
                            rust: (
                                <AffiliationLink
                                    href="https://rust-lang.org/governance/people/nuzzles/"
                                    icon={<FontAwesomeIcon icon={faRust} className="size-full" />}
                                />
                            ),
                            bevy: (
                                <AffiliationLink
                                    href="https://github.com/bevyengine/bevy"
                                    icon={affiliationIcon("bevy")}
                                />
                            ),
                            trunk: (
                                <AffiliationLink
                                    href="https://github.com/trunk-rs/trunk"
                                    icon={affiliationIcon("wasm")}
                                />
                            ),
                            linebender: (
                                <AffiliationLink href="https://linebender.org/" icon={affiliationIcon("linebender")} />
                            ),
                            uf: <a href="https://www.ufl.edu/" />,
                        }}
                    />
                </span>
            )}
            {hasBiographyDetails && expandable && (
                <button
                    className="text-link ms-1 rounded-sm lg:hidden"
                    aria-expanded={biographyExpanded}
                    aria-controls="profile-biography-details"
                    onClick={() => setExpandedBiography(biographyExpanded ? null : profileId)}
                >
                    {t(biographyExpanded ? "home.readLess" : "home.readMore")}
                </button>
            )}
        </p>
    )
}
