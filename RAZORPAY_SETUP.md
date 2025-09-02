# Razorpay Integration Setup Instructions

## 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Sign up for a new account or login to existing account
3. Complete the KYC process (required for live payments)

## 2. Get API Keys

1. Go to Razorpay Dashboard: [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate new API keys or use existing ones
4. Copy the **Key ID** and **Key Secret**

### Test Mode vs Live Mode

- **Test Keys**: Start with `rzp_test_` - Use these for development
- **Live Keys**: Start with `rzp_live_` - Use these for production

## 3. Configure Environment Variables

Update your `.env.local` file with the following:

```env
# Razorpay Configuration
# Replace with your actual keys from Razorpay dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
```

**Important**: 
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is safe to expose in frontend
- `RAZORPAY_KEY_SECRET` must be kept secure and only used on server-side
- Never commit actual API keys to version control

## 4. Set up Webhooks (Optional but Recommended)

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/razorpay/verify-payment` (PUT method)
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Generate and copy the **Webhook Secret**
5. Add it to your environment variables as `RAZORPAY_WEBHOOK_SECRET`

## 5. Database Migration

Run the database migration to add order tables:

```sql
-- Execute this in your Supabase SQL Editor
-- File: migrations/razorpay-orders.sql
```

## 6. Test Payment Flow

### Test Card Details for Testing:

- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name

### Test UPI ID:
- `success@razorpay`
- `failure@razorpay`

## 7. Go Live Checklist

1. ✅ Complete Razorpay KYC verification
2. ✅ Replace test keys with live keys
3. ✅ Set up proper webhook URLs
4. ✅ Test with small amounts first
5. ✅ Monitor payment dashboard

## Security Best Practices

1. **API Keys**:
   - Never expose secret key in frontend code
   - Use environment variables for all keys
   - Rotate keys periodically

2. **Payment Verification**:
   - Always verify payments on server-side
   - Use signature verification for webhooks
   - Never trust client-side payment confirmations

3. **Error Handling**:
   - Log payment failures for investigation
   - Provide user-friendly error messages
   - Set up monitoring for payment issues

## Troubleshooting

### Common Issues:

1. **\"Invalid key_id\" Error**:
   - Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is correct
   - Ensure no extra spaces in environment variable

2. **Payment Modal Not Opening**:
   - Verify Razorpay script is loaded (`window.Razorpay` exists)
   - Check browser console for script loading errors

3. **Payment Verification Failed**:
   - Verify `RAZORPAY_KEY_SECRET` is correct
   - Check signature generation logic

4. **Database Errors**:
   - Ensure database migration was run successfully
   - Check if user has proper permissions

### Support:

- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Integration Guide**: [https://razorpay.com/docs/payment-gateway/web-integration/standard/](https://razorpay.com/docs/payment-gateway/web-integration/standard/)
- **Support**: [https://razorpay.com/support/](https://razorpay.com/support/)

## Features Implemented

✅ **Order Creation**: Backend API creates Razorpay orders
✅ **Payment Processing**: Frontend integration with Razorpay checkout
✅ **Payment Verification**: Server-side signature verification
✅ **Database Integration**: Orders stored with payment details
✅ **Error Handling**: Comprehensive error handling and user feedback
✅ **Cart Integration**: Seamless integration with existing cart system
✅ **User Authentication**: Payment linked to authenticated users
✅ **Order Management**: Full order lifecycle management

## Next Steps

1. **Order Management Dashboard**: Build admin interface for order management
2. **Email Notifications**: Send order confirmations and receipts
3. **Inventory Management**: Integrate with stock management
4. **Refund System**: Implement refund processing
5. **Analytics**: Add payment analytics and reporting