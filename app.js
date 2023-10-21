import Order from "./models/Order.js";
import express from "express";
import dbConnection from "./services/db.js";
import bodyParser from "body-parser";

dbConnection();

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Defina uma rota GET para buscar dados no MongoDB
app.get("/api/pedidos", async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.json({ sucess: true, data: orders });
  } catch (error) {
    return res.json({ sucess: false, error });
  }
});

// Defina uma rota GET para buscar dados no MongoDB
app.delete("/api/pedido/:id", async (req, res) => {
  const id = req.params.id;

  console.log("ID: ", id);

  try {
    const order = await Order.findById(id);

    if (!order) {
      throw "Pedido não encontrado";
    }

    const deletedOrder = await Order.deleteOne({ _id: id });

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
    console.log("Body:", requestData);

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

    const order = new Order(requestData);
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso!",
      data: savedOrder,
    });
  } catch (error) {
    console.log("Erro: ", error);
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
