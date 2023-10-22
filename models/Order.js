const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  cliente: String,
  tipoPao: String,
  tipoQueijo: String,
  finalizado: {
    type: Boolean,
    default: false,
  },
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

module.exports = Order;
