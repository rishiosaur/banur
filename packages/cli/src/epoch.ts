import betterLogging from 'better-logging'
import { prompt } from 'enquirer'
import { Clone } from 'nodegit'
import shell from 'shelljs'

betterLogging(console)

const epochCommand = async () => {
	const { name, install, db } = (await prompt([
		{
			type: 'input',
			message: 'What would you like this server to be called?',
			name: 'name',
			initial: 'epoch',
			required: true,
		},

		{
			type: 'confirm',
			initial: true,
			required: true,
			name: 'install',
			message: 'Should I install dependencies right now?',
		},
		{
			type: 'input',
			message: 'What is the URL of your Postgres database?',
			name: 'db',
			initial: 'postgres://postgres@localhost/postgres',
			required: true,
		},
	])) as any

	console.info(`Cloning starter into './${name}/'`)

	await Clone.clone(
		'https://github.com/rishiosaur/epoch-starter.git',
		name
	).catch((e) => console.error(e))

	console.info(`Finished cloning into './${name}/'.`)

	shell.cd(name)

	if (install) {
		console.info(`Installing dependencies...`)

		try {
			shell.exec('yarn')
			console.info('Successfully installed!')
		} catch (e) {
			console.error(e)
		}
	}

	try {
		shell.exec(`echo "url=${db}" > .env`)
		console.info('Successfully added URL!')
	} catch (e) {
		console.error(e)
	}
}

export default epochCommand
