import ReactECharts from 'echarts-for-react';
import { User, GuestOrder } from '../types';

interface DashboardChartsProps {
  users?: User[];
  guestOrders?: GuestOrder[];
  activeTab: string;
  incomeByClass: {
    economy: number;
    business: number;
    first: number;
  };
}

export const DashboardCharts = ({ users, guestOrders, activeTab, incomeByClass }: DashboardChartsProps) => {
  // Calculate payment statistics based on active tab
  const getPaymentStats = () => {
    if (activeTab === 'users' && users) {
      const totalBookings = users.reduce((acc, user) => acc + user.bookings.length, 0);
      const unpaidBookings = users.reduce((acc, user) => 
        acc + user.bookings.filter(b => b.paymentStatus !== 'PAID').length, 0);
      
      return {
        paid: totalBookings - unpaidBookings,
        unpaid: unpaidBookings,
        total: totalBookings
      };
    } else if (activeTab === 'guestOrders' && guestOrders) {
      const unpaidOrders = guestOrders.filter(order => order.paymentStatus !== 'PAID').length;
      return {
        paid: guestOrders.length - unpaidOrders,
        unpaid: unpaidOrders,
        total: guestOrders.length
      };
    }
    return { paid: 0, unpaid: 0, total: 0 };
  };

  const paymentStats = getPaymentStats();

  const paymentPieOption = {
    title: {
      text: `${activeTab === 'users' ? 'User Bookings' : 'Guest Orders'} Payment Status`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },

    // legend: {
    //   orient: 'vertical',
    //   left: 'left',
    // },
    series: [
      {
        name: 'Payment Status',
        type: 'pie',
        radius: '50%',
        roseType: 'radius',
        // padAngle: 10,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
        data: [
          { 
            value: paymentStats.paid, 
            name: 'Paid',
            itemStyle: { color: '#52c41a' }
          },
          { 
            value: paymentStats.unpaid, 
            name: 'Unpaid',
            itemStyle: { color: '#ff4d4f' }
          }
        ],
        // emphasis: {
        //   itemStyle: {
        //     shadowBlur: 10,
        //     shadowOffsetX: 0,
        //     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //   }
        // }
      }
    ]
  };

  // Calculate total orders by class
  const getOrdersByClass = () => {
    const orders = {
      economy: 0,
      business: 0,
      first: 0
    };

    users?.forEach(user => {
      user.bookings.forEach(booking => {
        if (booking.paymentStatus.toLowerCase() === 'paid') {
          const price = booking.totalPrice;
          if (price >= 250 && price <= 410) {
            orders.economy += 1;
          } else if (price >= 750 && price <= 900) {
            orders.business += 1;
          } else if (price >= 1000 && price <= 1500) {
            orders.first += 1;
          }
        }
      });
    });

    return orders;
  };

  const ordersByClass = getOrdersByClass();

  const incomeMoneyOption = {
    title: {
      text: 'Income Distribution by Class (Amount)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '${c} ({d}%)'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left'
    // },
    // legend: {
    //     top: '10%',
    //     left: 'center'
    //   },
    series: [
      {
        name: 'Income',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '${c}',
        //   position: 'center',
        },
        // emphasis: {
        //     label: {
        //       show: true,
        //       fontSize: 20,
        //       fontWeight: 'bold'
        //     }
        //   },
        labelLayout:{
            draggable: true
          },
        data: [
          { 
            value: incomeByClass.economy, 
            name: 'Economy',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: incomeByClass.business, 
            name: 'Business',
            itemStyle: { color: '#722ed1' }
          },
          { 
            value: incomeByClass.first, 
            name: 'First Class',
            itemStyle: { color: '#faad14' }
          }
        ]
      }
    ]
  };

  const incomeOrdersOption = {
    title: {
      text: 'Income Distribution by Class (Orders)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} orders ({d}%)'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left'
    // },
    series: [
      {
        name: 'Orders',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{c} orders'
        },
        data: [
          { 
            value: ordersByClass.economy, 
            name: 'Economy',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: ordersByClass.business, 
            name: 'Business',
            itemStyle: { color: '#722ed1' }
          },
          { 
            value: ordersByClass.first, 
            name: 'First Class',
            itemStyle: { color: '#faad14' }
          }
        ]
      }
    ]
  };

  // Add new function to calculate overall order status
  const getOverallOrderStatus = () => {
    const userBookings = users?.reduce((acc, user) => [...acc, ...user.bookings], [] as Booking[]) || [];
    const userPaidOrders = userBookings.filter(b => b.paymentStatus === 'PAID').length;
    const guestPaidOrders = guestOrders?.filter(o => o.paymentStatus === 'PAID').length || 0;
    
    return {
      paid: userPaidOrders + guestPaidOrders,
      unpaid: (userBookings.length - userPaidOrders) + 
              ((guestOrders?.length || 0) - guestPaidOrders)
    };
  };

  const orderStatus = getOverallOrderStatus();

  const overallOrdersOption = {
    title: {
      text: 'Overall Orders Status',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} orders ({d}%)'
    },
    series: [
      {
        name: 'Orders Status',
        type: 'pie',
        radius: ['30%', '60%'],
        roseType: 'radius',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{c} orders'
        },
        data: [
          { 
            value: orderStatus.paid,
            name: 'Paid Orders',
            itemStyle: { color: '#52c41a' }
          },
          { 
            value: orderStatus.unpaid,
            name: 'Unpaid Orders',
            itemStyle: { color: '#ff4d4f' }
          }
        ]
      }
    ]
  };

  const getIncomeStats = () => {
    const userIncome = users?.reduce((total, user) => {
      const paidBookings = user.bookings.filter(b => b.paymentStatus.toLowerCase() === 'paid');
      return total + paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    }, 0) || 0;

    const guestIncome = guestOrders?.reduce((total, order) => {
      return order.paymentStatus === 'PAID' ? total + order.price : total;
    }, 0) || 0;

    return {
      user: userIncome,
      guest: guestIncome
    };
  };

  const incomeStats = getIncomeStats();

  const userGuestIncomeOption = {
    title: {
      text: 'Income Distribution (Users vs Guests)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    series: [
      {
        name: 'Income Source',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '${c}',
          position: 'outside'
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        data: [
          { 
            value: incomeStats.user, 
            name: 'User Bookings',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: incomeStats.guest, 
            name: 'Guest Orders',
            itemStyle: { color: '#faad14' }
          }
        ]
      }
    ]
  };

  const getDetailedIncomeStats = () => {
    if (activeTab === 'users' && users) {
      const income = {
        economy: 0,
        business: 0,
        first: 0
      };
      
      users.forEach(user => {
        user.bookings.forEach(booking => {
          if (booking.paymentStatus.toLowerCase() === 'paid') {
            const price = booking.totalPrice;
            if (price >= 250 && price <= 410) {
              income.economy += price;
            } else if (price >= 750 && price <= 900) {
              income.business += price;
            } else if (price >= 1000 && price <= 1500) {
              income.first += price;
            }
          }
        });
      });
      
      return income;
    } else if (activeTab === 'guestOrders' && guestOrders) {
      const income = {
        economy: 0,
        business: 0,
        first: 0
      };
      
      guestOrders.forEach(order => {
        if (order.paymentStatus === 'PAID') {
          const price = order.price;
          if (price >= 250 && price <= 410) {
            income.economy += price;
          } else if (price >= 750 && price <= 900) {
            income.business += price;
          } else if (price >= 1000 && price <= 1500) {
            income.first += price;
          }
        }
      });
      
      return income;
    }
    return { economy: 0, business: 0, first: 0 };
  };

  const detailedIncomeStats = getDetailedIncomeStats();

  const detailedIncomeOption = {
    title: {
      text: `${activeTab === 'users' ? 'User' : 'Guest'} Income by Seat Class`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    series: [
      {
        name: 'Income',
        type: 'pie',
        radius: '70%',
        roseType: 'radius',
        
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '${c}',
          position: 'outside'
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        data: [
          { 
            value: detailedIncomeStats.economy, 
            name: 'Economy',
            itemStyle: { color: '#1890ff' }
          },
          { 
            value: detailedIncomeStats.business, 
            name: 'Business',
            itemStyle: { color: '#722ed1' }
          },
          { 
            value: detailedIncomeStats.first, 
            name: 'First Class',
            itemStyle: { color: '#faad14' }
          }
        ]
      }
    ]
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactECharts option={incomeMoneyOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactECharts option={incomeOrdersOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactECharts option={overallOrdersOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <ReactECharts option={userGuestIncomeOption} style={{ height: '300px' }} />
        </div>
      </div>
      {(activeTab === 'users' || activeTab === 'guestOrders') && (
        <>
          <h1 className="text-2xl font-bold mb-4">{activeTab === 'users' ? 'User' : 'Guest'} Status</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <ReactECharts option={paymentPieOption} style={{ height: '300px' }} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <ReactECharts option={detailedIncomeOption} style={{ height: '300px' }} />
            </div>
          </div>
        </>
      )}
    </>
  );
}; 