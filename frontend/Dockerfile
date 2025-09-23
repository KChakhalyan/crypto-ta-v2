FROM node:20-bullseye

WORKDIR /app

# 1. Копируем package.json и lock-файл (если есть)
COPY package.json package-lock.json* ./

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем весь проект внутрь контейнера
COPY . .

# 4. Собираем проект
RUN npm run build

# 5. Запускаем Next.js
CMD ["npm", "run", "start"]
