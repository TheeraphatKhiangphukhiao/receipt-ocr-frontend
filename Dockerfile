FROM node:18 as build

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci --silent

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8029
CMD ["nginx", "-g", "daemon off;"]