FROM node:12-slim

# Built by deploy-node-app

WORKDIR /app

# Update stretch repositories （https://stackoverflow.com/a/76095392/769900）
RUN sed -i -e 's/deb.debian.org/archive.debian.org/g' \
           -e 's|security.debian.org|archive.debian.org/|g' \
           -e '/stretch-updates/d' /etc/apt/sources.list

# Add common build deps
RUN apt-get update && apt-get install -yqq nginx && \
  sed -i 's/root \/var\/www\/html/root \/app\/build/' /etc/nginx/sites-enabled/default && \
  chown -R node /app /home/node /etc/nginx /var/log/nginx /var/lib/nginx /usr/share/nginx && \
  rm -rf /var/lib/apt/lists/*

USER node

COPY package.json package-lock.json /app/

RUN npm install --production --no-cache --no-audit

COPY . /app/

CMD ["node", "dist/main.js"]

EXPOSE 3000
