const mongoose = require("mongoose");

let connection = { isConnected: false };

async function dbConnection() {
  if (connection.isConnected) {
    console.log("Reutilizando conexão do banco de dados");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGO_URI ? process.env.MONGO_URI : "",
      { dbName: "ComandaFacil" }
    );

    connection.isConnected = db.connections[0];

    console.log("Conectado ao banco de dados!");
  } catch (error) {
    console.error(error);
  }
}

module.exports = dbConnection;
