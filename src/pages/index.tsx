import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'
import Head from 'next/head'
import commonStyles from '../styles/common.module.scss';
import Link from 'next/link';
import styles from './home.module.scss';
import Header from '../components/Header';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(homeProps: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');

  useEffect(() => {
    setPosts(homeProps.postsPagination.results);
    setNextPage(homeProps.postsPagination.next_page);
  }, [homeProps.postsPagination.results, homeProps.postsPagination.next_page]);

  function handlePagination(): void {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setPosts([...posts, ...formattedData]);
        setNextPage(data.next_page);
      });
  }

  return(
    <>
      <Head>Home</Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <Header />
          {
            posts.map(p => (
              <Link href={`/post/${p.uid}`} key={p.uid}>
                <div className={styles.content}>
                  <h1>{ p.data.title }</h1>
                  <p>{ p.data.subtitle }</p>
                  <div>
                    <div className={styles.calendar}>
                      <img src="/images/calendar.png" alt="Date Publication" />
                      <p>{
                      format(
                        new Date(p.first_publication_date),
                        "d 'de' MMM yyyy",
                        {
                          locale: ptBR,
                        }
                      )}</p>
                    </div>
                    <div className={styles.author}>
                      <img src="/images/user.png" alt="Author" />
                      <p>{ p.data.author }</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
          {nextPage &&
          (
            <div className={styles.carregarMais}>
              <a href="#" onClick={handlePagination}>Carregar mais posts</a>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
   const prismic = getPrismicClient();
   const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 1
    });

    const posts: Post[] = postsResponse.results.map(p => {
      return {
        uid: p.uid,
        data: {
          author: p.data.author,
          subtitle: p.data.subtitle,
          title: p.data.title
        },
        first_publication_date: p.first_publication_date
      }
    })

    const postPagination: PostPagination = {
      next_page: postsResponse.next_page,
      results: posts
    }

    const homeProps: HomeProps = {
      postsPagination: postPagination
    }

  return {
    props: {
      ...homeProps
    }
  }
};
