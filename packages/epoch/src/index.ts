import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { MessageResolver, ChannelResolver } from './resolvers/index'
import betterLogging from 'better-logging'

betterLogging(console)

export class Epoch {
	private options: ConnectionOptions
	constructor(options: ConnectionOptions) {
		this.options = options
	}

	public async start(port?: number) {
		await createConnection({
			...this.options,
			synchronize: true,
			entities: ['./src/models/*.ts'],
		})

		const schema = await buildSchema({
			resolvers: [MessageResolver, ChannelResolver],
			// authChecker: authChecker,
			validate: false,
		})

		const server = new ApolloServer({
			schema,
			introspection: true,
			playground: true,
			context: ({ req }) => {
				const context = req
				return context
			},
		})
		await server.listen(port || 3000)
		console.info('Epoch server has started.')
	}
}
