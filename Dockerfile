FROM node:11.1.0-alpine

#installing git needed for npm
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

#copying the app
RUN chmod -R ugo+rw /opt
ADD ./ /opt/user-feedback/
RUN ls -la /opt/user-feedback/
RUN cd /opt/user-feedback && rm -rf node_modules
RUN chmod -R ugo+rw /opt
RUN cd /opt/user-feedback && npm install --loglevel verbose


#bash script to be executed by docker-compose when starting the docker
COPY docker/start-ubisoft-user-feedback.sh /usr/local/bin/
RUN chmod ugo+x /usr/local/bin/start-ubisoft-user-feedback.sh
RUN chmod ugo+x /opt/user-feedback/database/*.sh


#running our script when the docker starts
ENTRYPOINT ["/usr/local/bin/start-ubisoft-user-feedback.sh"]

