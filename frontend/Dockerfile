# develop stage
FROM node:16-alpine3.14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm i -g @quasar/cli
COPY . .
#RUN npm
RUN quasar build

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/Nginx.conf /etc/nginx/conf.d

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
