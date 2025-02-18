import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-4">
        <AdminMenu />
      
        <div className="overflow-x-auto mt-15">
          <table className="w-full min-w-[800px] ml-[4rem] border-collapse border border-gray-300">
            <thead className="border bg-gray-100">
              <tr>
                <th className="p-2 text-left text-nowrap">ITEMS</th>
                <th className="p-2 text-left text-nowrap">ID</th>
                <th className="p-2 text-left text-nowrap">USER</th>
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
                      alt={order._id}
                      className="w-[4rem] rounded-md"
                    />
                  </td>
                  <td className="p-2 text-nowrap">{order._id}</td>
                  <td className="p-2 text-nowrap">
                    {order.user ? order.user.username : "N/A"}
                  </td>
                  <td className="p-2 text-nowrap">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
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
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      )}
    </>
  );
};

export default OrderList;