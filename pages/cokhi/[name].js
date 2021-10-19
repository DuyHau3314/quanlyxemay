import ChiTietCoKhi from '../../components/Cokhi/ChiTietCoKhi';
import { useRouter } from 'next/router';
import queryString from 'query-string';

const ChiTiet = ({ queryNameShow }) => {
  return (
    <div>
      <ChiTietCoKhi queryNameShow={queryNameShow} />
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
