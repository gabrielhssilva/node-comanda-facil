# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte para o diretório de trabalho
COPY . .

# Exponha a porta em que o aplicativo será executado (substitua a porta conforme necessário)
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["node", "app.js"]
