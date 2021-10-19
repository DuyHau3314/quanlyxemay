import ChiTietNhua from '../../components/Nhua/ChiTietNhua';
import { useRouter } from 'next/router';
const ChiTiet = ({ queryNameShow }) => {
  const router = useRouter();
  console.log(router.query.name);
  return (
    <div>
      <ChiTietNhua
        nameRouter={router.query.name}
        queryNameShow={queryNameShow}
      />
    </div>
  );
};

export default ChiTiet;

export async function getServerSideProps({ req }) {
  return {
    props: {
      queryNameShow: req.__NEXT_INIT_QUERY.name,
    },
  };
}
