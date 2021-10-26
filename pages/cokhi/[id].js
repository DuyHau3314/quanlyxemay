import ChiTietCoKhi from '../../components/Cokhi/ChiTietCoKhi';

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
