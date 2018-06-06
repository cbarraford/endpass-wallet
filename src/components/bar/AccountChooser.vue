<template lang="html">
  <div class="account-chooser field has-addons">
    <div class="control">
      <div class="select">
        <select @change="setActiveAccount" v-model="selectedAccountId">
          <option v-for="(account, i) in accounts"
                  :value="i">
          {{i}}. {{account.getAddressString() |truncateAddr}}
          </option>
        </select>
      </div>
    </div>
    <div :disabled="!hdWallet" class="new-account control">
      <a class="button is-primary" @click="openNewAccountModal">&plus;</a>
    </div>
    <new-account-modal @close="closeNewAccountModal"
      v-if="newAccountModalOpen"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import NewAccountModal from '@/components/NewAccountModal'
import accounts from '@/mixins/accounts'

export default {
  data () {
    return {
      selectedAccountId: 0,
      newAccountModalOpen: false
    }
  },
  computed: {
    hdWallet () {
      return this.$store.state.accounts.hdWallet
    },
    selectedAccount () {
      if (!this.accounts.length) {
        return
      }
      return this.accounts[this.selectedAccountId]
    },
    accounts () {
      return this.$store.state.accounts.accounts
    },
  },
  methods: {
    ...mapActions('accounts', {
      setActiveAccountToStore:'setActiveAccount',
    }),
    setActiveAccount() {
      let account = this.selectedAccount
      if (!account) {
        return
      }
      this.setActiveAccountToStore(account).catch(e => {
        this.$notify({
          title: e.title,
          text: e.text,
          type: 'is-warning',
        });
        console.error(e);
      });
    },
    openNewAccountModal() {
      this.newAccountModalOpen = true
    },
    closeNewAccountModal() {
      this.newAccountModalOpen = false
    }
  },
  filters: {
    // Truncate an address to the first 4 and last 4 characters
    truncateAddr(value) {
      if (!value) return ''
      value = value.toString()
    return `${value.substr(0,4)}...${value.substr(value.length-4)}`
    }
  },
  components: {
    NewAccountModal
  },
  mixins: [accounts]
}
</script>