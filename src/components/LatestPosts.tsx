import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { getSpencerBlogPath, isProfileId } from "@/profiles"
import { getConfiguredSite } from "@/site"

type Post = { title: string; url: string; date: string; description: string; opinion?: boolean }
export const LatestPosts = () => {
    const { t, language } = useLanguage()
    const site = getConfiguredSite()
    const blog = getSpencerBlogPath(window.location.hostname, isProfileId(site) ? site : null)
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
                    {t("latest.more")} <ArrowRight aria-hidden="true" />
                </a>
            </div>
            <ol className="latest-list">
                {posts.map((post) => (
                    <li key={post.url}>
                        <time dateTime={post.date}>
                            {new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(new Date(post.date))}
                        </time>
                        <h3 lang="en">
                            <a href={post.url} target="_blank" rel="noopener noreferrer">
                                {post.title}
                            </a>
                            {post.opinion === true && <span className="opinion-badge">Opinion</span>}
                        </h3>
                        <p lang="en">{post.description}</p>
                    </li>
                ))}
            </ol>
        </section>
    )
}
