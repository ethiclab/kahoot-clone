FROM ubuntu
RUN apt-get update > /dev/null 2>&1 && \
    apt-get install -y gcc g++ make > /dev/null 2>&1 && \
    apt-get install -y nginx > /dev/null 2>&1 && \
    apt-get install -y curl > /dev/null 2>&1 && \
    curl -fsSL https://deb.nodesource.com/setup_17.x | bash - > /dev/null 2>&1 && \
    apt-get install -y nodejs > /dev/null 2>&1 && \
    npm install -g npm@8.1.1 > /dev/null 2>&1 && \
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null 2>&1 && \
     echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list >/dev/null 2>&1 && \
    apt-get update > /dev/null 2>&1 && \
    apt-get install -y yarn > /dev/null 2>&1 && \
    npm install -g pm2 > /dev/null 2>&1
RUN apt-get install -y postgresql > /dev/null 2>&1
RUN mkdir /app
COPY . /app
WORKDIR /app/db
USER postgres
RUN /etc/init.d/postgresql start && \
    psql < init.sql && \
    psql kwizz < SEED_users_table.sql && \
    psql kwizz < SEED_quizes_table.sql && \
    psql kwizz < SEED_questions_table.sql && \
    psql kwizz < grant.sql
USER root
WORKDIR /app
EXPOSE 80 3030
VOLUME /usr/share/nginx/html /app/server
CMD nginx && /etc/init.d/postgresql start && pm2 start server/index.js && pm2 logs
