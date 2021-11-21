import Head from "next/head";
import { useRouter } from "next/router";
function user() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>Your page, {id}</title>
      </Head>
    </>
  );
}

export default user;
