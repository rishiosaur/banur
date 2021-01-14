import {
	Arg,
	Field,
	ID,
	InputType,
	Mutation,
	PubSub,
	PubSubEngine,
	Query,
	Resolver,
	Root,
	Subscription,
} from 'type-graphql'
import Message from '../models/Message'
import Channel from '../models/Channel'

enum SubscriptionTopics {
	MESSAGECREATION = 'MESSAGECREATION',
	MESSAGEDELETION = 'MESSAGEDELETION',
	MESSAGEUPDATES = 'MESSAGEUPDATES',
	MESSAGEALL = 'MESSAGEALL',

	CHANNELUPDATES = 'CHANNELUPDATES',
	CHANNELDELETION = 'CHANNELDELETION',
	CHANNELCREATION = 'CHANNELCREATION',
	CHANNELALL = 'CHANNELALL',
}

@InputType()
class CreateMessageInput {
	@Field(() => String)
	from: string

	@Field(() => String)
	message: string

	@Field(() => String)
	channel: string
}

@InputType()
class UpdateMessageInput {
	@Field(() => ID)
	message: string

	@Field(() => String)
	content: string
}

@Resolver()
export class MessageResolver {
	@Query(() => Message)
	message(@Arg('id') id: string) {
		return Message.findOneOrFail(id, {
			relations: ['channel'],
		})
	}

	@Query(() => [Message])
	messages() {
		return Message.find({
			relations: ['channel'],
		})
	}

	@Mutation(() => Message)
	async sendMessage(
		@PubSub() pubSub: PubSubEngine,
		@Arg('data')
		{ from, message: _message, channel: _channel }: CreateMessageInput
	) {
		const message = new Message()
		const channel = await Channel.findOneOrFail(_channel, {
			relations: ['messages'],
		})

		message.user = from
		message.content = _message
		message.channel = channel

		channel.messages?.push(message)

		await message.save()
		await channel.save()

		await pubSub.publish(SubscriptionTopics.MESSAGECREATION, message)
		return message
	}

	@Mutation(() => Message)
	async updateMessage(
		@PubSub() pubSub: PubSubEngine,
		@Arg('data') data: UpdateMessageInput
	) {
		const message = await Message.findOneOrFail(data.message)

		Object.assign(message, data as Omit<UpdateMessageInput, 'message'>)

		await message.save()

		await pubSub.publish(SubscriptionTopics.MESSAGEUPDATES, message)

		return message
	}

	@Mutation(() => Message)
	async deleteMessage(
		@PubSub() pubSub: PubSubEngine,
		@Arg('message') _message: string
	) {
		const message = await (await Message.findOneOrFail(_message)).remove()

		await pubSub.publish(SubscriptionTopics.MESSAGEDELETION, message)

		return message
	}

	@Subscription({
		topics: SubscriptionTopics.MESSAGECREATION,
		filter: ({ payload, args }) =>
			(payload as Message).channel?.id === args.channel,
	})
	messageCreation(
		@Root() messagePayload: Message,
		@Arg('channel') _channel: string
	): Message {
		return messagePayload
	}

	@Subscription({
		topics: SubscriptionTopics.MESSAGEUPDATES,
		filter: ({ payload, args }) =>
			(payload as Message).channel?.id === args.channel,
	})
	messageUpdates(
		@Root() messagePayload: Message,
		@Arg('channel') _channel: string
	): Message {
		return messagePayload
	}

	@Subscription({
		topics: SubscriptionTopics.MESSAGEDELETION,
		filter: ({ payload, args }) =>
			(payload as Message).channel?.id === args.channel,
	})
	messageDeletion(
		@Root() messagePayload: Message,
		@Arg('channel') _channel: string
	): Message {
		return messagePayload
	}
}

@InputType()
class CreateChannelInput {
	@Field(() => String)
	id: string

	@Field(() => String)
	topic: string

	@Field(() => String)
	description: string
}

@InputType()
class UpdateChannelInput {
	@Field(() => String)
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

	@Mutation(() => Channel)
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

	@Mutation(() => Message)
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
	})
	channelDeletion(@Root() messagePayload: Channel): Channel {
		return messagePayload
	}
}
