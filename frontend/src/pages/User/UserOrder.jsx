import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 ml-[4rem]">My Orders</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="overflow-x-auto mt-4 ml-[4rem]">
          <table className="w-full min-w-[800px] border-collapse border border-gray-300">
            <thead className="border bg-gray-100">
              <tr>
                <th className="p-2 text-left text-nowrap">IMAGE</th>
                <th className="p-2 text-left text-nowrap">ID</th>
                <th className="p-2 text-left text-nowrap">DATE</th>
                <th className="p-2 text-left text-nowrap">TOTAL</th>
                <th className="p-2 text-left text-nowrap">PAID</th>
                <th className="p-2 text-left text-nowrap">DELIVERED</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border">
                  <td className="p-2">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-[4rem] rounded-md"
                    />
                  </td>
                  <td className="p-2 text-nowrap">{order._id}</td>
                  <td className="p-2 text-nowrap">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-2 text-nowrap">$ {order.totalPrice}</td>
                  <td className="p-2 text-center">
                    <p
                      className={`p-1 w-[6rem] rounded-full ${
                        order.isPaid ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </p>
                  </td>
                  <td className="p-2 text-center">
                    <p
                      className={`p-1 w-[6rem] rounded-full ${
                        order.isDelivered ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </p>
                  </td>
                  <td className="p-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
