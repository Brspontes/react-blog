import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
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

export default function Home() {
  return(
    <>
      <Head>Home</Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <Header />
          <div className={styles.content}>
            <h1>Como utlizar Hooks</h1>
            <p>Pensando em sincronização ao invés de ciclo de vida</p>
            <div>
              <div className={styles.calendar}>
                <img src="/images/calendar.png" alt="Date Publication" />
                <p>15 mar 2021</p>
              </div>
              <div className={styles.author}>
                <img src="/images/user.png" alt="Author" />
                <p>Brian</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
