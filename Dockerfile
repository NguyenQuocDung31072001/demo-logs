FROM node:16-alpine as BUILDER

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV production

RUN yarn build



# ==============================

FROM node:16-alpine as PRODUCTION

WORKDIR /app

COPY --from=BUILDER /app/package.json ./
COPY --from=BUILDER /app/yarn.lock ./
COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/dist ./dist

RUN yarn install --production --frozen-lockfile

# ==============================

FROM node:16-alpine


WORKDIR /app


COPY --from=PRODUCTION /app/node_modules ./node_modules
COPY --from=PRODUCTION /app/dist ./dist
COPY --from=PRODUCTION /app/package.json ./

ENV NODE_ENV production

EXPOSE 8080
CMD ["yarn", "start:prod"]
