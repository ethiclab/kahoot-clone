#!/usr/bin/env bash
cp kwizz.conf $EASY_DOMAINS_DIR/$EASY_LETSENCRYPT_DOMAIN
easy proxy reload
