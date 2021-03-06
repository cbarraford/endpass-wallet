<template lang="html">
  <div class="tokens-page">
    <div class="section">
      <div class="container">
        <div class="columns is-reverse-mobile">
          <div class="column is-half">
            <div class="card app-card">
              <div class="card-header">
                <p class="card-header-title">Your Tokens</p>
              </div>
              <div class="card-content is-narrow">
                <nav v-if="activeTokens.length" class="panel">
                  <div class="panel-block">
                    <search-input v-model="search" />
                  </div>
                  <v-spinner
                    :is-loading="isLoading"
                    class="spinner-block"
                  />
                  <div class="scroller">
                    <a
                      v-for="(token, index) in userTokenList"
                      :key="token.address + 'sub'"
                      class="panel-block is-clearfix is-block"
                    >
                      <span class="token-symbol">{{ token.symbol }}</span>
                      <span class="token-name">{{ token.name }}</span>
                      <balance
                        class="is-small is-inline-block"
                        :amount="getTokenAmount(token)"
                        :currency="''"
                      />
                      <balance
                        v-if="prices && prices[token.symbol]"
                        class="is-small is-inline-block"
                        :amount="getTokenAmount(token)"
                        :currency="currency"
                        :decimals="2"
                        :price="getTokenPrice(token.symbol)"
                        @update="updateTokenPrice(token.symbol)"
                      />
                      <span
                        :id="`remove-token-${index}`"
                        class="icon has-text-danger is-small is-pulled-right"
                        title="Remove Token"
                        @click.prevent="removeTokenFromSubscription(token)"
                        v-html="require('@/img/ban.svg')"
                      />
                    </a>
                  </div>
                </nav>
                <p v-else class="small">You have no tokens on this network. Add
                some!</p>
              </div>
            </div>
          </div>
          <div class="column is-half">
            <div class="card">
              <div class="card-header">
                <div class="card-header-title">
                  Add Token
                </div>
                <div class="card-header-icon">
                  <a class="button is-outlined is-info is-small" @click.prevent="openAddTokenModal()">
                    Add Custom Token
                  </a>
                </div>
              </div>
              <div class="card-content">
                <multiselect
                   :allow-empty="false"
                   :internal-search="false"
                   :options="searchTokenList"
                   :show-labels="false"
                   track-by="address"
                   label="name"
                   placeholder="Select token"
                   @search-change="setSearchToken"
                   @select="addTokenToSubscription"
                   />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <add-token-modal
      v-if="addTokenModalOpen"
      @close="closeAddTokenModal"
    />
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { BigNumber } from 'bignumber.js';
import Balance from '@/components/Balance';
import SearchInput from '@/components/SearchInput.vue';
import AddTokenModal from '@/components/AddTokenModal';
import VSpinner from '@/components/ui/VSpinner';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'tokens-page',
  data() {
    return {
      search: '',
      searchToken: '',
      addTokenModalOpen: false,
      tokens: [],
      serializeInterval: null,
      subscription: null,
    };
  },
  computed: {
    ...mapState({
      activeTokens: state => state.tokens.activeTokens,
      prices: state => state.tokens.prices,
      ethPrice: state => state.price.price,
      currency: state => state.accounts.settings.fiatCurrency,
    }),
    ...mapGetters('tokens', ['savedActiveTokens', 'net']),
    isLoading() {
      return this.savedActiveTokens.length > this.activeTokens.length;
    },
    filteredTokens() {
      return this.tokens.filter(
        token =>
          !this.activeTokens.some(
            activeToken => activeToken.address === token.address,
          ),
      );
    },
    searchTokenList() {
      const { searchToken } = this;

      if (!searchToken) {
        return this.filteredTokens;
      }

      const search = searchToken.toLowerCase();

      return this.filteredTokens.filter(token => {
        const { name, symbol } = token;

        return (
          name.toLowerCase().includes(search) ||
          symbol.toLowerCase().includes(search)
        );
      });
    },
    userTokenList() {
      const { search } = this;

      if (!search) {
        return this.activeTokens;
      }

      const searchLC = search.toLowerCase();

      return this.activeTokens.filter(token =>
        token.symbol.toLowerCase().includes(searchLC),
      );
    },
  },
  watch: {
    net: {
      handler() {
        this.getAllTokens().then((tokens = []) => {
          this.tokens = tokens;
        });
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('tokens', [
      'addTokenToSubscription',
      'updateTokenPrice',
      'removeTokenFromSubscription',
      'getAllTokens',
    ]),
    getTokenAmount(token) {
      let balanceBn = new BigNumber(token.balance);
      let decimalsBn = new BigNumber(10).pow(token.decimals);
      return balanceBn.div(decimalsBn);
    },
    getTokenPrice(symbol) {
      return new BigNumber(this.prices[symbol]['ETH'])
        .times(this.ethPrice)
        .toString();
    },
    setSearchToken(query) {
      this.searchToken = query;
    },
    openAddTokenModal() {
      this.addTokenModalOpen = true;
    },
    closeAddTokenModal() {
      this.addTokenModalOpen = false;
    },
  },
  components: {
    SearchInput,
    Balance,
    AddTokenModal,
    Multiselect,
    VSpinner,
  },
};
</script>

<style lang="scss">
@import 'vue-multiselect/dist/vue-multiselect.min.css';
.scroller {
  max-height: 500px;
  overflow-y: scroll;
}

.panel {
  .panel-heading {
    background-color: $primary;
    &:first-child {
      border-top: none;
    }
    border: none;
    border-radius: 0;

    color: $white;
    font-weight: 600;
    text-transform: uppercase;
  }

  .panel-block {
    &:first-child {
      border-top: none;
    }

    .field {
      &.is-expanded {
        flex-grow: 1;
      }
    }
  }
}

.token-symbol {
  font-weight: 600;
}

.tokens-page {
  .spinner-block {
    height: 108px;
  }
}
</style>
