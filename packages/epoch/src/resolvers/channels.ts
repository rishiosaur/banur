import { PubSubEngine } from 'apollo-server'
import {
	InputType,
	Field,
	Arg,
	Mutation,
	Subscription,
	Root,
	Query,
	Resolver,
	PubSub,
	ID,
} from 'type-graphql'
import Channel from '../models/Channel'
import Message from '../models/Message'
import { SubscriptionTopics } from './subscriptions'

@InputType()
class CreateChannelInput {
	@Field(() => ID)
	id: string

	@Field(() => String)
	topic: string

	@Field(() => String)
	description: string
}

@InputType()
class UpdateChannelInput {
	@Field(() => ID)
	id: string

	@Field(() => String, {
		nullable: true,
	})
	topic: string

	@Field(() => String, {
		nullable: true,
	})
	description: string
}

@Resolver()
export class ChannelResolver {
	@Query(() => [Channel])
	channels() {
		return Channel.find({
			relations: ['messages'],
		})
	}

	@Query(() => Channel)
	channel(@Arg('id') id: string) {
		return Channel.findOneOrFail(id, {
			relations: ['messages'],
		})
	}

	@Mutation(() => Channel)
	async createChannel(
		@PubSub() pubSub: PubSubEngine,
		@Arg('data') data: CreateChannelInput
	) {
		const channel = new Channel()

		Object.assign(channel, data)

		channel.messages = []

		await channel.save()

		await pubSub.publish(SubscriptionTopics.CHANNELCREATION, channel)

		return channel
	}

	@Mutation(() => Channel, {
		description: 'Create a channel with test data.',
	})
	async updateChannel(
		@PubSub() pubSub: PubSubEngine,
		@Arg('data') data: UpdateChannelInput
	) {
		const channel = await Channel.findOneOrFail(data.id)

		Object.assign(channel, data as Omit<UpdateChannelInput, 'id'>)

		await channel.save()

		await pubSub.publish(SubscriptionTopics.CHANNELUPDATES, channel)

		return channel
	}

	@Mutation(() => Message, {
		description:
			'Delete a specific channel (erases all other entries & relationships with messages)',
	})
	async deleteChannel(
		@PubSub() pubSub: PubSubEngine,
		@Arg('channel') _channel: string
	) {
		const channel = await (await Channel.findOneOrFail(_channel)).remove()

		await pubSub.publish(SubscriptionTopics.CHANNELDELETION, channel)

		return channel
	}

	@Subscription({
		topics: SubscriptionTopics.CHANNELCREATION,
		filter: ({ payload, args }) => (payload as Channel)?.id === args.channel,
		description: 'Subscribe to channel creations.',
	})
	channelCreation(
		@Root() messagePayload: Channel,
		@Arg('channel') _channel: string
	): Channel {
		return messagePayload
	}

	@Subscription({
		topics: SubscriptionTopics.CHANNELUPDATES,
		filter: ({ payload, args }) => (payload as Channel)?.id === args.channel,
		description: 'Subscribe to channel updates.',
	})
	channelUpdates(
		@Root() messagePayload: Channel,
		@Arg('channel') _channel: string
	): Channel {
		return messagePayload
	}

	@Subscription({
		topics: SubscriptionTopics.CHANNELDELETION,
		filter: ({ payload, args }) => (payload as Channel)?.id === args.channel,
		description: 'Subscribe to channel deletions.',
	})
	channelDeletion(@Root() messagePayload: Channel): Channel {
		return messagePayload
	}
}
