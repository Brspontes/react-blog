import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import { FiUser, FiClock, FiCalendar } from "react-icons/fi";
import styles from './post.module.scss';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  } else {
    return (
      <>
        <Head>
          <title>POST | {post.data.title}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <Header />
          </div>
        </div>
        <div className={styles.banner}>
          <img src={post?.data?.banner.url} alt="banner" />
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h1>{post?.data?.title}</h1>
            <div className={styles.infos}>
              <div className={styles.calendar}>
                <FiCalendar />
                <span>
                  {
                    format(
                      new Date(post?.first_publication_date),
                      "d 'de' MMM yyyy",
                      {
                        locale: ptBR,
                      }
                    )
                  }
                </span>
              </div>
              <div className={styles.user}>
                <FiUser />
                <span>{post?.data?.author}</span>
              </div>
              <div className={styles.time}>
                <FiClock />
                <span>4 min</span>
              </div>
            </div>
          </div>
          <div className={styles.contentText}>
          {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  try {

  } catch (error) {
    console.log(error)
  }

  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { pageSize: 3 }
  );

  const paths = posts.results.map(result => {
    return {
      params: {
        slug: result.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content.map(item => ({
        heading: item.heading,
        body: [...item.body],
      })),
    },
  };

  return {
    props: {
      post
    }
  };
};
