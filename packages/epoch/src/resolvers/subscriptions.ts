/**
 * All possible subscription types.
 *
 * @export
 * @enum {string}
 */
export enum SubscriptionTopics {
	MESSAGECREATION = 'MESSAGECREATION',
	MESSAGEDELETION = 'MESSAGEDELETION',
	MESSAGEUPDATES = 'MESSAGEUPDATES',
	MESSAGEALL = 'MESSAGEALL',

	CHANNELUPDATES = 'CHANNELUPDATES',
	CHANNELDELETION = 'CHANNELDELETION',
	CHANNELCREATION = 'CHANNELCREATION',
	CHANNELALL = 'CHANNELALL',
}
