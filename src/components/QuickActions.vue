<template>
  <div class="quick-actions">
    <div class="navbar is-fixed-bottom">
      <router-link active-class="is-active" class="navbar-item button" to="/" exact>
        <span class="icon is-small"
              v-html="require('@/img/home.svg')"></span>
        <span class="caption">Home</span>
      </router-link>
      <router-link
              :disabled="!wallet"
              active-class="is-active"
              class="navbar-item button"
              :to="{name: 'SendPage'}">
        <span class="icon is-small"
              v-html="require('@/img/arrow-thick-left.svg')"></span>
        <span class="caption">Send</span>
      </router-link>
      <router-link class="navbar-item button"
                   :disabled="!address"
                   active-class="is-active"
                   :to="{name:
                   'ReceivePage'}">
        <span class="icon is-small"
              v-html="require('@/img/arrow-thick-right.svg')"></span>
        <span class="caption">Recieve</span>
      </router-link>
      <router-link class="navbar-item button"
                   :disabled="!address"
                   active-class="is-active"
                   :to="{name: 'HistoryPage'}">
        <span class="icon is-small"
              v-html="require('@/img/clock.svg')"></span>
        <span class="caption">History</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      wallet: state => state.accounts.wallet,
      address: state => state.accounts.address && state.accounts.address.getAddressString()
    }),
    ...mapGetters('accounts', ['isPublicAccount']),
  },
}
</script>

<style lang="scss">
.quick-actions {
  //flex: 1;

  .navbar {
    background: $white;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    .navbar-item {
      span {
        display: block;
        margin: 0 auto;
      }
    }

    .button {
      border: none;
      .icon {
        margin: 0 auto;
      }
    }
  }
}
</style>
