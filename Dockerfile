FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
ENV DATABASE_URL mysql://root:1234@localhost:3306/mydb
COPY . .
RUN npm run prisma:generate
RUN npm run prisma:migrate
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "start:prod"]