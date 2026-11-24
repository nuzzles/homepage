import { type ReactNode } from "react"
import { Trans } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRust } from "@fortawesome/free-brands-svg-icons"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"

const AffiliationLink = ({ href, icon, children }: { href: string; icon: ReactNode; children?: ReactNode }) => (
    <a href={href} className="affiliation" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true" className="affiliation-icon">
            {icon}
        </span>
        <span className="min-w-0">{children}</span>
    </a>
)
const affiliationIcon = (name: string) => <img src={`/images/affiliations/${name}.svg`} alt="" />

export const ProfileBiography = () => {
    const { t } = useLanguage()
    const profileId = useProfile().id
    const links = {
        rust: (
            <AffiliationLink
                href="https://rust-lang.org/governance/people/nuzzles/"
                icon={<FontAwesomeIcon icon={faRust} className="size-full" />}
            />
        ),
        bevy: <AffiliationLink href="https://github.com/bevyengine/bevy" icon={affiliationIcon("bevy")} />,
        trunk: <AffiliationLink href="https://github.com/trunk-rs/trunk" icon={affiliationIcon("wasm")} />,
        linebender: <AffiliationLink href="https://linebender.org/" icon={affiliationIcon("linebender")} />,
        blue: <a href="https://www.blueorigin.com/" target="_blank" rel="noopener noreferrer" />,
        uf: <a href="https://www.ufl.edu/" target="_blank" rel="noopener noreferrer" />,
    }
    return (
        <p className="biography">
            <Trans t={t} i18nKey={`home.biographies.${profileId}.introduction`} components={links} />
        </p>
    )
}
