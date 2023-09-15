# Start with a base image containing the Bun runtime
FROM oven/bun:latest

WORKDIR /app

COPY bun-generator.tsx ./

EXPOSE 5000

CMD ["bun", "run", "bun-generator.tsx"]
