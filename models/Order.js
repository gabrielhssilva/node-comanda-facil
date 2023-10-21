import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  cliente: String,
  tipoPao: String,
  tipoQueijo: String,
  complementos: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");

export default Order;
