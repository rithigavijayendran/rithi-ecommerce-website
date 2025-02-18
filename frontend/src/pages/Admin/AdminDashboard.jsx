import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#4F46E5"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Sales Trend",
        align: "center",
        style: { fontSize: "18px", fontWeight: "bold" },
      },
      grid: {
        borderColor: "#ddd",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: { fontWeight: "bold" },
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: { fontWeight: "bold" },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: salesDetail.map((item) => item._id),
          },
        },
        series: [{ name: "Sales", data: salesDetail.map((item) => item.totalSales) }],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem] p-6">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg w-64 text-center">
            <div className="text-4xl">💰</div>
            <p className="mt-4 text-lg font-semibold">Total Sales</p>
            <h1 className="text-2xl font-bold">
              {isLoading ? <Loader /> : `$ ${sales?.totalSales?.toFixed(2)}`}
            </h1>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg w-64 text-center">
            <div className="text-4xl">👥</div>
            <p className="mt-4 text-lg font-semibold">Customers</p>
            <h1 className="text-2xl font-bold">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-lg shadow-lg w-64 text-center">
            <div className="text-4xl">📦</div>
            <p className="mt-4 text-lg font-semibold">Total Orders</p>
            <h1 className="text-2xl font-bold">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Chart options={state.options} series={state.series} type="bar" width="200%" />
        </div>

        <div className="mt-10">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
