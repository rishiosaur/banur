import { Field, ObjectType, ID } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm'
import Message from './Message'

@ObjectType()
@Entity()
export default class Channel extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn()
	id: string

	@Column()
	@Field(() => String)
	topic: string

	@Column()
	@Field(() => String)
	description: string

	@Field(() => [Message], {
		nullable: true,
	})
	@OneToMany(() => Message, (message) => message.channel)
	messages?: Message[]

	@Field(() => Date)
	@CreateDateColumn()
	created_at: Date

	@Field(() => Date)
	@UpdateDateColumn()
	updated_at: Date
}
