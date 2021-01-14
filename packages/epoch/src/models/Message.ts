import { Field, ObjectType, ID } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Channel from './Channel'

@ObjectType()
@Entity()
export default class Message extends BaseEntity {
	@Field(() => ID, {
		description: 'Message ID discriminator. Uses uuid pattern.',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => String, {
		description: 'Content of the message.',
	})
	@Column()
	content: string

	@Field(() => Channel, {
		nullable: true,
	})
	@ManyToOne(() => Channel, (channel) => channel.messages)
	channel?: Channel

	@Field(() => String, {
		description: 'User ID that sent the message.',
	})
	@Column()
	user: string

	@Field(() => Date)
	@CreateDateColumn()
	created_at: Date

	@Field(() => Date)
	@UpdateDateColumn()
	updated_at: Date
}
