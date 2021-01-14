import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { MessageResolver, ChannelResolver } from './resolvers/index'
import betterLogging from 'better-logging'
import Channel from './models/Channel'
import Message from './models/Message'

betterLogging(console)

export class Epoch {
	private options: ConnectionOptions
	constructor(options: ConnectionOptions) {
		this.options = options
	}

	public async start(port?: number) {
		await createConnection({
			synchronize: true,
			entities: [Message, Channel],
			...this.options,
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

const cl = new Epoch({
	type: 'postgres',
	url: 'postgres://postgres@localhost:5455/postgres',
})

cl.start()
