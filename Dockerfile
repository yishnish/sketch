FROM ubuntu

#install node
RUN apt-get -qq update
RUN apt-get -qq -y install curl
RUN apt-get -qq -y install iputils-ping 
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get -qq -y install nodejs
RUN apt-get -qq -y install build-essential

#set up docker image
#dockerized folder is shared from host folder
EXPOSE 3000
CMD ["node", "/dockerized/index.js"]
