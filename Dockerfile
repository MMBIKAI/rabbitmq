FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

CMD ["tail", "-f", "/dev/null"]
