const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const orderSchema = require("./models/Order.js");

const app = express();
// app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

const dbConnection = require("./services/db.js");
dbConnection();

const port = process.env.PORT || 3000;

// Defina uma rota GET para buscar dados no MongoDB
app.get("/api/pedidos", async (req, res) => {
  try {
    const orders = await orderSchema.find({});
    return res.json({ sucess: true, data: orders });
  } catch (error) {
    return res.json({ sucess: false, error });
  }
});

// Defina uma rota PUT para atualizar o estado do pedido
app.put("/api/pedido/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const order = await orderSchema.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado",
      });
    }

    const { finalizado } = req.body;

    if (finalizado !== undefined) {
      order.finalizado = finalizado;
      const updatedOrder = await order.save();

      return res.json({
        success: true,
        message: "Estado do pedido atualizado com sucesso!",
        data: updatedOrder,
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "O campo 'finalizado' é obrigatório para a atualização do estado do pedido.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Defina uma rota GET para buscar dados no MongoDB
app.delete("/api/pedido/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const order = await orderSchema.findById(id);

    if (!order) {
      throw "Pedido não encontrado";
    }

    const deletedOrder = await orderSchema.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Pedido deletado com sucesso!",
      data: deletedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

app.post("/api/pedido", async (req, res) => {
  try {
    const requestData = req.body;
    if (
      !requestData.cliente ||
      !requestData.tipoPao ||
      !requestData.tipoQueijo ||
      requestData.complementos.length === 0
    ) {
      throw "Preencha corretamente todos os dados do pedido.";
    }

    // Verifica se já existe um pedido com o mesmo cliente (opcional)
    // const existingOrder = await Order.findOne({ cliente: requestData.cliente });
    // if (existingOrder) {
    //   throw "Já existe um pedido para este cliente.";
    // }

    const order = new orderSchema(requestData);
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso!",
      data: savedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

// ATUALIZAÇÃO EM TEMPO REAL
const server = http.createServer(app);

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("Cliente conectado");
});

const mongoose = require("mongoose");
const Order = mongoose.model("Order");

const changeStream = Order.watch();

changeStream.on("change", (change) => {
  io.emit("order-change", change);
});

// FINAL ATUALIZAÇÃO EM TEMPO REAL

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
