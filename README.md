# kahoot clone

It is not fully working since a getting started manual is missing.

Now you can play although.

## Getting started

1. Install postgres
1. Create tables
1. Configure auth0
1. Clone this repository and start the frontend

```bash
git clone git@github.com:ethiclab/kahoot-clone.git
cd kahoot-clone
yarn install --frozen-lockfile
npm start
```

1. Start server from another terminal window

```bash
cd kahoot-clone
node server/index.js
```

## Founds problems

1. It needs a postgres db
1. Javascript library massive is not working: Our solution was to use directly pg-promise
1. You need to manually create tables by executing the following scripts
   under db folder.

        SEED_*.sql

1. You need a free auth0 account and configure a machine-to-machine app
   with the following confguration: (Maybe not all is needed)

        Allowed Callback URLs: http://localhost:3030/auth/callback, http://localhost:3030/auth
        Allowed Logout URLs: http://localhost:3000/logout
        Allowed Web Origins: http://localhost:3000, http://localhost:3030
        Allowed Origins (CORS): http://localhost:3000, http://localhost:3030
        Advanced Settings: Grant Types: Authorization Code + Client Credentials

1. We have created a file server/cfg.js where you have to configure according to your setup.

## TODO

1. Add more documentation
1. Finish to port sql statements from massive scripts under db folder to plain queries using pg-promise.
