'use client';

import { useState } from 'react';

interface Order {
  id: string;
  user_id: string;
  plan_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  receipt: string;
  amount: number;
  currency: string;
  status: string;
  payment_status: string;
  items: any[];
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
  users?: {
    name: string;
    email: string;
  };
}

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export default function OrderDetails({ order, onClose, onUpdateStatus }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`/api/admin/orders?id=${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          tracking_number: trackingNumber
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onUpdateStatus(order.id, status);
        alert('Order status updated successfully');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    
    return (
      <div className="space-y-1">
        <div className="font-semibold text-gray-900">{address.fullName}</div>
        <div>{address.addressLine1}</div>
        {address.addressLine2 && <div>{address.addressLine2}</div>}
        <div>{address.city}, {address.state} {address.zipCode}</div>
        <div className="text-gray-600">Phone: {address.phone}</div>
        {address.email && <div className="text-gray-600">Email: {address.email}</div>}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Order Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Order ID:</div>
                  <div className="font-medium">{order.id.substring(0, 8)}...</div>
                  
                  <div className="text-gray-500">Razorpay Order ID:</div>
                  <div className="font-medium">{order.razorpay_order_id || 'N/A'}</div>
                  
                  <div className="text-gray-500">Amount:</div>
                  <div className="font-medium">₹{order.amount}</div>
                  
                  <div className="text-gray-500">Status:</div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="text-gray-500">Created:</div>
                  <div className="font-medium">{formatDate(order.created_at)}</div>
                  
                  <div className="text-gray-500">Customer:</div>
                  <div className="font-medium">
                    {order.users?.name || 'N/A'}<br/>
                    <span className="text-gray-500 text-xs">{order.users?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Update Status</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="created">Created</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    placeholder="Enter tracking number"
                  />
                </div>
                
                <button
                  onClick={handleUpdateStatus}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Shipping Address</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {order.shipping_address ? (
                formatAddress(order.shipping_address)
              ) : (
                <div className="text-gray-500 italic">No shipping address provided</div>
              )}
            </div>
          </div>
          
          {/* Billing Address */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Billing Address</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {order.billing_address ? (
                formatAddress(order.billing_address)
              ) : (
                <div className="text-gray-500 italic">No billing address provided</div>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Order Items</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {order.items && order.items.length > 0 ? (
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <div className="font-medium">{item.name || item.toy?.name || 'Unknown Item'}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity || 1}</div>
                      </div>
                      <div className="font-medium">₹{item.price_at_time || item.toy?.price || 0}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No items in this order</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}