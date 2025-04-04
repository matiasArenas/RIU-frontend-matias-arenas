FROM node:20 AS build

WORKDIR /app

# Copia solo los archivos de package.json y package-lock.json primero para que Docker cachee la instalación de dependencias
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/ /usr/share/nginx/html

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80

# Inicia Nginx en modo no demonizado
CMD ["nginx", "-g", "daemon off;"]