import { ShipmentItem, ShipmentStatus } from '@/views/order/shipment/types'

export const mockShipmentData: ShipmentItem[] = [
  {
    id: '1',
    shipmentNo: 'SP202401001',
    salesOrderNo: 'SO202401001',
    truckingNo: '1234567890123',
    carrier: 'fedex',
    status: ShipmentStatus.Delivered,
    channel: 'amazon',
    channelName: 'Amazon US',
    dispatchedNo: 'DP2024001',
    channelSalesOrderNo: 'AMZ-112-1234567',
    shipDate: '2024-01-15',
    recipient: {
      name: '张三',
      address: '北京市朝阳区建国路88号SOHO现代城',
      phone: '13888888888',
      email: 'zhangsan@email.com'
    },
    sender: {
      name: '发货仓库',
      address: '广东省深圳市南山区科技园',
      phone: '0755-12345678'
    },
    packageInfo: {
      weight: 2.5,
      dimensions: {
        length: 30,
        width: 20,
        height: 15
      },
      value: 299.99,
      description: '电子产品'
    },
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-14 19:40:00',
        status: ShipmentStatus.InTransit,
        location: 'LOUISVILLE, KY',
        description: '到达FedEx配送站',
        operator: 'FedEx'
      },
      {
        id: '2',
        timestamp: '2024-01-14 19:42:00',
        status: ShipmentStatus.InTransit,
        location: 'LOUISVILLE, KY',
        description: '货物准时到达',
        operator: 'FedEx'
      },
      {
        id: '3',
        timestamp: '2024-01-14 23:52:00',
        status: ShipmentStatus.InTransit,
        location: 'LOUISVILLE, KY',
        description: '离开FedEx始发站',
        operator: 'FedEx'
      },
      {
        id: '4',
        timestamp: '2024-01-15 11:00:00',
        status: ShipmentStatus.InTransit,
        location: 'OKOLONA, AR',
        description: '运输中',
        operator: 'FedEx'
      },
      {
        id: '5',
        timestamp: '2024-01-15 18:33:00',
        status: ShipmentStatus.InTransit,
        location: 'CYPRESS, TX',
        description: '到达FedEx配送站',
        operator: 'FedEx'
      },
      {
        id: '6',
        timestamp: '2024-01-15 21:40:00',
        status: ShipmentStatus.InTransit,
        location: 'CYPRESS, TX',
        description: '离开FedEx配送站',
        operator: 'FedEx'
      },
      {
        id: '7',
        timestamp: '2024-01-16 10:40:00',
        status: ShipmentStatus.InTransit,
        location: 'HOUSTON, TX',
        description: '运输中',
        operator: 'FedEx'
      },
      {
        id: '8',
        timestamp: '2024-01-16 22:41:00',
        status: ShipmentStatus.InTransit,
        location: 'HOUSTON, TX',
        description: '运输中',
        operator: 'FedEx'
      },
      {
        id: '9',
        timestamp: '2024-01-17 19:30:00',
        status: ShipmentStatus.InTransit,
        location: 'HOUSTON, TX',
        description: '运输中',
        operator: 'FedEx'
      },
      {
        id: '10',
        timestamp: '2024-01-18 05:01:00',
        status: ShipmentStatus.InTransit,
        location: 'HOUSTON, TX',
        description: '到达本地FedEx配送站',
        operator: 'FedEx'
      },
      {
        id: '11',
        timestamp: '2024-01-18 05:15:00',
        status: ShipmentStatus.InTransit,
        location: 'HOUSTON, TX',
        description: 'FedEx配送车辆装载中',
        operator: 'FedEx'
      },
      {
        id: '12',
        timestamp: '2024-01-18 10:08:00',
        status: ShipmentStatus.Delivered,
        location: 'Houston, TX',
        description: '已签收',
        operator: 'FedEx'
      }
    ],
    createDate: '2024-01-15 09:00:00',
    updateDate: '2024-01-18 10:08:00',
    estimatedDelivery: '2024-01-18 16:00:00',
    actualDelivery: '2024-01-18 10:08:00',
    notes: '易碎物品，请小心处理'
  },
  {
    id: '2',
    shipmentNo: 'SP202401002',
    salesOrderNo: 'SO202401002',
    truckingNo: '9876543210987',
    carrier: 'ups',
    status: ShipmentStatus.Delivered,
    channel: 'ebay',
    channelName: 'eBay Global',
    dispatchedNo: 'DP2024002',
    channelSalesOrderNo: 'EB-556-7890123',
    shipDate: '2024-01-10',
    recipient: {
      name: '李四',
      address: '上海市浦东新区陆家嘴金融区',
      phone: '13999999999',
      email: 'lisi@email.com'
    },
    sender: {
      name: '发货仓库',
      address: '江苏省苏州市工业园区',
      phone: '0512-12345678'
    },
    packageInfo: {
      weight: 1.8,
      dimensions: {
        length: 25,
        width: 18,
        height: 12
      },
      value: 199.99,
      description: '服装配件'
    },
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-10 10:00:00',
        status: ShipmentStatus.New,
        location: '苏州仓库',
        description: '运单已创建',
        operator: '系统'
      },
      {
        id: '2',
        timestamp: '2024-01-10 15:30:00',
        status: ShipmentStatus.InTransit,
        location: '苏州转运中心',
        description: '货物已发出',
        operator: 'UPS'
      },
      {
        id: '3',
        timestamp: '2024-01-11 09:45:00',
        status: ShipmentStatus.InTransit,
        location: '上海转运中心',
        description: '到达UPS配送站',
        operator: 'UPS'
      },
      {
        id: '4',
        timestamp: '2024-01-11 19:15:00',
        status: ShipmentStatus.InTransit,
        location: '上海市浦东新区',
        description: '正在派送中',
        operator: 'UPS'
      },
      {
        id: '5',
        timestamp: '2024-01-12 14:20:00',
        status: ShipmentStatus.Delivered,
        location: '上海市浦东新区',
        description: '已签收',
        operator: 'UPS'
      }
    ],
    createDate: '2024-01-10 10:00:00',
    updateDate: '2024-01-12 14:20:00',
    estimatedDelivery: '2024-01-12 16:00:00',
    actualDelivery: '2024-01-12 14:20:00'
  },
  {
    id: '3',
    shipmentNo: 'SP202401003',
    salesOrderNo: 'SO202401003',
    truckingNo: '5555666677778',
    carrier: 'dhl',
    status: ShipmentStatus.New,
    channel: 'walmart',
    channelName: 'Walmart Marketplace',
    dispatchedNo: 'DP2024003',
    channelSalesOrderNo: 'WM-998-2468135',
    shipDate: '2024-01-16',
    recipient: {
      name: '王五',
      address: '广州市天河区珠江新城',
      phone: '13777777777',
      email: 'wangwu@email.com'
    },
    sender: {
      name: '发货仓库',
      address: '广东省东莞市松山湖',
      phone: '0769-12345678'
    },
    packageInfo: {
      weight: 0.8,
      dimensions: {
        length: 20,
        width: 15,
        height: 8
      },
      value: 99.99,
      description: '数码配件'
    },
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-16 11:30:00',
        status: ShipmentStatus.New,
        location: '东莞仓库',
        description: '运单已创建，等待发货',
        operator: '系统'
      }
    ],
    createDate: '2024-01-16 11:30:00',
    updateDate: '2024-01-16 11:30:00',
    estimatedDelivery: '2024-01-20 16:00:00',
    notes: '客户要求加急处理'
  },
  {
    id: '4',
    shipmentNo: 'SP202401004',
    salesOrderNo: 'SO202401004',
    truckingNo: '1111222233334',
    carrier: 'usps',
    status: ShipmentStatus.Closed,
    channel: 'shopify',
    channelName: 'Shopify Store',
    dispatchedNo: 'DP2024004',
    channelSalesOrderNo: 'SP-123-3579246',
    shipDate: '2024-01-05',
    recipient: {
      name: '赵六',
      address: '杭州市西湖区文三路',
      phone: '13666666666',
      email: 'zhaoliu@email.com'
    },
    sender: {
      name: '发货仓库',
      address: '浙江省义乌市商贸城',
      phone: '0579-12345678'
    },
    packageInfo: {
      weight: 3.2,
      dimensions: {
        length: 35,
        width: 25,
        height: 20
      },
      value: 399.99,
      description: '家居用品'
    },
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-05 08:00:00',
        status: ShipmentStatus.New,
        location: '义乌仓库',
        description: '运单已创建',
        operator: '系统'
      },
      {
        id: '2',
        timestamp: '2024-01-05 16:00:00',
        status: ShipmentStatus.InTransit,
        location: '义乌转运中心',
        description: '货物已发出',
        operator: 'USPS'
      },
      {
        id: '3',
        timestamp: '2024-01-06 10:30:00',
        status: ShipmentStatus.InTransit,
        location: '杭州转运中心',
        description: '货物到达目的地城市',
        operator: 'USPS'
      },
      {
        id: '4',
        timestamp: '2024-01-07 15:45:00',
        status: ShipmentStatus.Delivered,
        location: '杭州市西湖区',
        description: '货物已签收',
        operator: 'USPS'
      },
      {
        id: '5',
        timestamp: '2024-01-10 09:00:00',
        status: ShipmentStatus.Closed,
        location: '系统',
        description: '运单已关闭',
        operator: '系统'
      }
    ],
    createDate: '2024-01-05 08:00:00',
    updateDate: '2024-01-10 09:00:00',
    estimatedDelivery: '2024-01-08 16:00:00',
    actualDelivery: '2024-01-07 15:45:00',
    notes: '运单处理完成，已关闭'
  }
] 