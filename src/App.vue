<script>
	import global from "./utils/global";

	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "./scss/base";
	@import "./scss/animate";
	@import "./scss/variable";
	@import "./scss/main";
</style>
