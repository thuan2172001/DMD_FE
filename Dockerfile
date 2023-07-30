FROM public.ecr.aws/s9f1h1p1/node:14-dev

WORKDIR /app 

ENV NODE_ENV production

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lock

COPY . .

RUN npm run-script build
