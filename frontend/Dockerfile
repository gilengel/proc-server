# develop stage
FROM node:14.17.4-alpine3.14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .
RUN yarn
RUN quasar build

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/Nginx.conf /etc/nginx/conf.d

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]