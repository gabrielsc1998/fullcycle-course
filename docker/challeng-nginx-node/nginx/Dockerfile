FROM nginx:1.15.0-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

# RUN mkdir /etc/nginx/sites-available -p
# RUN mkdir /etc/nginx/sites-enabled -p

# COPY myserver /etc/nginx/sites-available

# RUN ln -s /etc/nginx/sites-available/myserver /etc/nginx/sites-enabled/

CMD ["nginx", "-g", "daemon off;"]