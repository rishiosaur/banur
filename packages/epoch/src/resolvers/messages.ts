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
} from 'type-graphql'
import Channel from '../models/Channel'
import Message from '../models/Message'
import { SubscriptionTopics } from './subscriptions'
import { ID } from 'type-graphql'

@InputType()
class CreateMessageInput {
	@Field(() => String)
	user: string

	@Field(() => String)
	content: string

	@Field(() => String)
	channel: string
}

@InputType()
class UpdateMessageInput {
	@Field(() => ID)
	id: string

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
		{ user, content: _message, channel: _channel }: CreateMessageInput
	) {
		const message = new Message()
		const channel = await Channel.findOneOrFail(_channel, {
			relations: ['messages'],
		})

		message.user = user
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
		const message = await Message.findOneOrFail(data.id)

		Object.assign(message, data)

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
