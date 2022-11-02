FROM nginx:1.15.0-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY index.html /var/www/html/

COPY nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]