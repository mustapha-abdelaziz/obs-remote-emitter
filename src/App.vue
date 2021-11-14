<template>
	<div
		class="notification-top-bar"
		:class="[isError ? 'error-message' : 'success-message', errorClass]"
		v-if="logMessage"
	>
		<i class="fa fa-info-circle"></i>
		<p style="display: inline; margin-left:5px;">{{ logMessage }}</p>
	</div>

	<div class="container">
		<div class="form" v-if="!serverConnected">
			<p type="IP Adress:">
				<input
					type="text"
					value="192.168.1.227"
					placeholder="192.168.1.227"
					name="ipAddress"
					ref="ipAddress"
				/>
			</p>
			<p type="Port Number:">
				<input
					type="text"
					placeholder="4444"
					value="4444"
					name="portNumber"
					ref="portNumber"
				/>
			</p>
			<p type="Password:">
				<input
					type="password"
					placeholder="20212021"
					value="20212021"
					name="password"
					ref="password"
				/>
			</p>
			<button @click="myFunction" :disabled="serverConnected" default>
				Connect
			</button>
		</div>
	</div>

	<div class="log" v-if="serverConnected">
		<h2>Server Log</h2>
		<textarea
			name="log"
			id="log"
			cols="50"
			rows="20"
			readonly
			v-model="logContent"
		>
		</textarea>
	</div>
</template>

<script>
export default {
	name: "App",

	data: () => {
		return {
			serverConnected: false,
			logMessage: "",
			isError: false,
			logContent: "",
		};
	},

	methods: {
		async myFunction() {
			console.log("clicked");
			const OBSWebSocket = require("obs-websocket-js");
			const io = require("socket.io-client");

			//const socket = io.connect("http://localhost:3000");
			const socket = io.connect("https://obs-timer-api.herokuapp.com");

			const obs = new OBSWebSocket();

			//connect to OBS

			if (!this.serverConnected) {
				try {
					await obs.connect({
						address:
							this.$refs["ipAddress"].value +
							":" +
							this.$refs["portNumber"].value,
						password: this.$refs["password"].value,
					});
					this.serverConnected = true;
					this.isError = false;

					///
					this.logMessage = "Connected to the server successfully";

					this.logContent += "// Connection to OBS established \n\n";
				} catch (error) {
					console.log("error here: ", error);
					this.logMessage = error.description;
					this.isError = true;
				}
			}

			obs.on("MediaStarted", (source) => {
				obs
					.send("GetMediaDuration", { sourceName: source.sourceName })
					.then((res) => {
						let mediaDuration = res.mediaDuration;

						//send data to the server

						socket.emit("counter", mediaDuration);

						//Adding log information
						this.logContent +=
							"// Media changed | Duration: " + mediaDuration + " ms \n";
						this.logContent += "// Data submitted to the server \n\n";
					});
			});
		},
	},
};

//const socket=io.connect("http://127.0.0.1:3000")
</script>

<style>
@import url("//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css");

#app {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: "Product-sans", sans-serif;
}

.container {
	margin: 2rem;
	width: 400px;
	display: flex;
	justify-content: center;
	align-content: center;
	justify-items: center;
	align-items: center;
	flex-direction: column;
}

.error-message {
	color: #d8000c !important;
	background-color: #ffbaba;
}

.success-message {
	color: #227700 !important;
	background: #dff2bf;
}

.notification-top-bar {
	position: fixed;
	top: 0;
	left: 0;
	height: 30px;
	line-height: 30px;
	width: 100%;
	text-align: center;
	color: #ffffff;
	font-weight: lighter;
	font-size: 14px;
	z-index: 9999;
}
.notification-top-bar p {
	padding: 0;
	margin: 0;
}
.notification-top-bar p a {
	padding: 5px 10px;
	border-radius: 3px;
	background: #fff;
	color: #1abc9c;
	font-weight: bold;
	text-decoration: none;
}

.form {
	min-width: 350px;
	background: #e6e6e6;
	border-radius: 8px;
	box-shadow: 0 0 15px -10px rgb(66, 66, 66);
	padding: 20px 30px;

	box-sizing: border-box;

	position: relative;
}

input {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	background: none;
	outline: none;
	resize: none;
	border: 0;
	transition: all 0.3s;
	border-bottom: 2px solid #bebed2;
}
input:focus {
	border-bottom: 2px solid #78788c;
}
.form p:before {
	content: attr(type);
	display: block;
	margin: 28px 0 0;
	font-size: 18px;
	color: #5a5a5a;
}
button {
	float: right;
	padding: 8px 12px;
	margin: 8px 0 0;
	border: 2px solid #78788c;
	background: 0;
	color: #5a5a6e;
	cursor: pointer;
	transition: all 0.3s;
}
button:hover {
	background: #78788c;
	color: #fff;
}

span {
	margin: 0 5px 0 15px;
}
</style>
