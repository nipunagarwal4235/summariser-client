FROM node:alpine3.20 as build

ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.3-alpine
WORKDIR /usr/share/nginx/html
# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
