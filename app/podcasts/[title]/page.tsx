import { Metadata } from "next";
import { getArticles } from "@/app/functions/getArticles";
import PostNavigation from "@/components/PostNavigation";
import SocialSharing from "@/components/SocialSharing";
import Link from "next/link";

type AuthorData = {
  author: string;
  job: string;
  city: string;
  avatar: string;
  imgAlt: string;
  slug: string;
  biography: {
    summary: string;
    body: string;
  };
  articles: ArticleData[];
};

type ArticleData = {
  title: string;
  img: string;
  date: string;
  read: string;
  label: string;
  slug: string;
};

type Params = Promise<{ title: string }>;
export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const articles: AuthorData[] = await getArticles();
  const params = await props.params;
  const { title } = params;


  const articleData = articles.find((article) =>
    article.articles.find((articleItem) => articleItem.slug === title)
  );

  if (!articleData) {
    return {
      title: "Article Not Found",
    };
  }

  const matchingArticle = articleData.articles.find(
    (articleItem) => articleItem.slug === title
  );

  return {
    title: `${matchingArticle?.title || "Article"} | Fyrre Magazine`,
  };
}

export default async function ArticleDetails(props: { params: Params }) {
  try {
    const articles: AuthorData[] = await getArticles();
    const params = await props.params;
    const { title } = params;

    const articleData = articles.find((article) =>
      article.articles.find((articleItem) => articleItem.slug === title)
    );

    if (!articleData) {
      return <p>Article not found</p>;
    }

    const matchingArticle = articleData.articles.find(
      (articleItem) => articleItem.slug === title
    );

    const latestArticles = articles
      .flatMap((author) => author.articles)
      .filter((article) => article.slug !== title)
      .slice(0, 3);

    if (!matchingArticle) {
      return <p>Article not found</p>;
    }

    return (
      <main className="max-w-[95rem] w-full mx-auto px-4 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
        <PostNavigation href="/magazine">Magazine</PostNavigation>
        <article className="max-w-[75rem] w-full mx-auto">
          <h1 className="text-center text-blog-heading pb-6">{matchingArticle.title}</h1>
          <div className="flex justify-center pb-16">
            <div className="flex gap-8">
              <span className="flex">
                <p className="font-semibold pr-2">Author</p>
                <Link href={`/authors/${articleData.slug}`}>{articleData.author}</Link>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">Date</p>
                <time dateTime={matchingArticle.date}>{matchingArticle.date}</time>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">Read</p>
                <p>{matchingArticle.read}</p>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">City</p>
                <p>{matchingArticle.label}</p>
              </span>
            </div>
          </div>
          <div className="pb-16">
            <img
              className="w-full h-[31.25rem] object-cover"
              src={matchingArticle.img}
              alt={matchingArticle.title}
            />
            <div className="flex justify-between pt-4">
              <p className="text-lg">Image by Author</p>
              <SocialSharing
                links={[
                  {
                    href: "#",
                    ariaLabel: "Visit our Instagram page",
                    src: "/icons/ri_instagram-line.svg",
                    alt: "Instagram logo",
                  },
                  {
                    href: "#",
                    ariaLabel: "Visit our Twitter page",
                    src: "/icons/ri_twitter-fill.svg",
                    alt: "Twitter logo",
                  },
                  {
                    href: "#",
                    ariaLabel: "Visit our YouTube page",
                    src: "/icons/ri_youtube-fill.svg",
                    alt: "YouTube logo",
                  },
                ]}
              />
            </div>
          </div>
          {/* Aquí agregarías el contenido del artículo */}
          <div className="pb-12">
            <p className="text-blog-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            {/* ... más contenido del artículo ... */}
          </div>
        </article>
        <div className="pb-12 md:pb-48">
          <h2 className="text-blog-subheading border-t-2 border-black mt-[9.5rem] pt-12 pb-12 md:pb-24">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {latestArticles.map((article, index) => (
              <article key={index} className="flex flex-col">
                <Link href={`/magazine/${article.slug}`}>
                  <img
                    className="w-full h-[18.75rem] object-cover hover:scale-105 transition"
                    src={article.img}
                    alt={article.title}
                  />
                </Link>
                <p className="heading3-title py-4">
                  <Link href={`/magazine/${article.slug}`}>{article.title}</Link>
                </p>
                <div className="flex gap-8">
                  <span className="flex">
                    <p className="font-semibold pr-2">Date</p>
                    <time dateTime={article.date}>{article.date}</time>
                  </span>
                  <span className="flex">
                    <p className="font-semibold pr-2">City</p>
                    <p>{article.label}</p>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching article details:", error);
    return <p>Error fetching article details</p>;
  }
}