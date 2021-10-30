#!/usr/bin/env bash
DIR=$(pwd)
DATE=$(which date)
GDATE=$(which gdate 2>/dev/null)
if [ -x "$GDATE" ]; then
    DATE=$GDATE
fi

function LOG_INFO {
    >&2 echo "$($DATE +"%F %T.%N") - [INFO ] - $*"
}

function throw {
  LOG_INFO $@
  return 1
}

function dock {
  [[ -z "$1" ]] && throw "usage $0 <container>" && return 1
  LOG_INFO $@
  docker stop $1 2>/dev/null
  docker rm $1 2>/dev/null
  docker build . -t ethiclab/$1 || return 1
  docker run -d --name $1 \
    -v "$DIR/default.conf:/etc/nginx/sites-available/default" \
    -v "$DIR/build:/usr/share/nginx/html" \
    ethiclab/$1
  docker network connect ethicnet $1
}

yarn install --frozen-lockfile
yarn build
dock kwizz
./update-proxy-conf.sh
