import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  status: 'active' | 'completed' | 'pending' | 'failed';
  returns: number;
  transactionDetails?: {
    checkoutRequestId?: string;
    merchantRequestId?: string;
    mpesaReceiptNumber?: string;
    phoneNumber?: string;
    transactionDate?: Date;
  };
}

const investmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'pending', 'failed'],
    default: 'pending'
  },
  returns: {
    type: Number,
    default: 0
  },
  transactionDetails: {
    checkoutRequestId: String,
    merchantRequestId: String,
    mpesaReceiptNumber: String,
    phoneNumber: String,
    transactionDate: Date
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
investmentSchema.index({ userId: 1 });
investmentSchema.index({ status: 1 });

export const Investment = mongoose.model<IInvestment>('Investment', investmentSchema);

export default Investment;