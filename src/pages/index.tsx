import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

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

  console.log(JSON.stringify(homeProps))
  console.log(JSON.stringify(homeProps.postsPagination))

  return(
    <>
      <Head>Home</Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <Header />
          {
            homeProps.postsPagination?.results.map(p => (
              <div className={styles.content}>
                <h1>{ p.data.title }</h1>
                <p>{ p.data.subtitle }</p>
                <div>
                  <div className={styles.calendar}>
                    <img src="/images/calendar.png" alt="Date Publication" />
                    <p>{ p.first_publication_date }</p>
                  </div>
                  <div className={styles.author}>
                    <img src="/images/user.png" alt="Author" />
                    <p>{ p.data.author }</p>
                  </div>
                </div>
              </div>
            ))
          }
          <div className={styles.carregarMais}>
            <a href="#">Carregar mais posts</a>
          </div>
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
      pageSize: 100
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
      next_page: '1',
      results: posts
    }

    const homeProps: HomeProps = {
      postsPagination: postPagination
    }

  return {
    props: {
      homeProps
    }
  }
};
