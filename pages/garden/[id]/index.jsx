import Head from "next/head";
import { useRouter } from "next/router";
function garden() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>The garden {id}</title>
      </Head>
    </>
  );
}

export default garden;
