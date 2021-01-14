import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { MessageResolver, ChannelResolver } from './resolvers/index'
import betterLogging from 'better-logging'
import Channel from './models/Channel'
import Message from './models/Message'

betterLogging(console)

/**
 * The Epoch server—a community server following the Banur specification.
 *
 * @export
 * @class Epoch
 */
export class Epoch {
	private options: ConnectionOptions

	/**
	 * Creates an instance of Epoch.
	 * @param {ConnectionOptions} options
	 * @memberof Epoch
	 */
	constructor(options: ConnectionOptions) {
		this.options = options
	}

	/**
	 * Starts an instance of a Banur server.
	 *
	 * @param {number} [port] Port to start server with.
	 * @memberof Epoch
	 */
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
