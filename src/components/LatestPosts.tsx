import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useLanguage } from "@/hooks/useLanguage"
import { getProfileBlogPath, isProfileId } from "@/profiles"
import { getConfiguredSite } from "@/site"

type Post = { title: string; url: string; date: string; description: string }
export const LatestPosts = () => {
    const profile = useProfile()
    const { t, language } = useLanguage()
    const site = getConfiguredSite()
    const blog = getProfileBlogPath(window.location.hostname, profile.id, isProfileId(site) ? site : null)
    const [posts, setPosts] = useState<Post[]>([])
    useEffect(() => {
        if (!blog) return
        const controller = new AbortController()
        fetch(`${blog}latest.json`, { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) throw new Error("Feed unavailable")
                const data: unknown = await response.json()
                if (!Array.isArray(data)) throw new Error("Invalid feed")
                const valid = data.filter(
                    (post): post is Post =>
                        post &&
                        typeof post.title === "string" &&
                        typeof post.description === "string" &&
                        typeof post.url === "string" &&
                        post.url.startsWith(blog) &&
                        typeof post.date === "string" &&
                        Number.isFinite(Date.parse(post.date))
                )
                if (!controller.signal.aborted) setPosts(valid.slice(0, 3))
            })
            .catch(() => {
                /* The blog link remains available if the feed cannot load. */
            })
        return () => controller.abort()
    }, [blog])
    if (!blog) return null
    return (
        <section className="latest-section" aria-labelledby="latest-title">
            <div className="section-heading">
                <h2 id="latest-title">{t("latest.title")}</h2>
                <a className="text-link" href={blog} target="_blank" rel="noopener noreferrer">
                    {t("latest.more")} <ArrowUpRight aria-hidden="true" />
                </a>
            </div>
            <div className="latest-grid">
                {posts.map((post) => (
                    <article key={post.url}>
                        <time dateTime={post.date}>
                            {new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(new Date(post.date))}
                        </time>
                        <h3 lang="en">
                            <a href={post.url} target="_blank" rel="noopener noreferrer">
                                {post.title}
                            </a>
                        </h3>
                        <p lang="en">{post.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
