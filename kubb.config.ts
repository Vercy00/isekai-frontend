import { defineConfig } from "@kubb/core"
import { pluginClient } from "@kubb/plugin-client"
import { pluginOas } from "@kubb/plugin-oas"
import { pluginTs } from "@kubb/plugin-ts"
import { pluginZod } from "@kubb/plugin-zod"
import axios from "axios"

// const proxyBaseURL = "http://localhost:3000/api"
const baseURL = "http://localhost:8080"
const docsPath = "/v3/api-docs"

const services = ["anime", "fansub", "users"] as const

async function config() {
  const configs = Promise.all(
    services.map(async (service) => ({
      input: {
        data: (await axios.get(`${baseURL}/${service}${docsPath}`)).data,
      },
      output: {
        path: `./gen/${service}`,
      },
      plugins: [
        pluginOas(),
        pluginTs(),
        pluginZod({
          output: {
            path: "./zod",
          },
          group: { type: "tag", name: ({ group }) => `${group}Schemas` },
          typed: true,
          dateType: "stringOffset",
          unknownType: "unknown",
          importPath: "@/lib/i18n/zod",
        }),
        pluginClient({
          output: {
            path: "./clients/axios",
            barrelType: "named",
            banner: "/* eslint-disable no-alert, no-console */",
            footer: "",
          },
          group: {
            type: "tag",
            name: ({ group }) => `${group}Service`,
          },
          transformers: {
            name: (name) => {
              return `${name}Client`
            },
          },
          operations: true,
          parser: "client",
          pathParamsType: "object",
          dataReturnType: "data",
          baseURL,
          // client: "axios",
          importPath: "@/lib/axios",
        }),
      ],
    }))
  )

  return defineConfig(configs)
}

export default config
