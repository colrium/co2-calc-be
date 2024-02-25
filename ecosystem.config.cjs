module.exports = {
	apps: [
		{
			name: 'ghg-be',
			exec_mode: 'cluster',
			instances: '2', // Or a number of instances
			script: './src/index.js',
			ignore_watch: ['node_modules'],
			exp_backoff_restart_delay: 100, // optional, adjust as needed
			watch: true, // optional, adjust as needed
			max_memory_restart: '400M' // optional, adjust as needed
		}
	]
};