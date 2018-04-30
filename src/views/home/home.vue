<template>
  <div v-scroll="onScroll">
  <!--新增界面-->
    <div class="image" @click="imgClick">
      <img src="../../assets/image/banner.jpg" alt="">
    </div>
    <section class="container">
      <feature-list>
        <feature-item
          :feature="item"
          v-for="(item, index) in features"
          :key="index"
        />
      </feature-list>

      <section class="fund-list">
        <div class="left left-rate">
          <div class="left-title">
            指数基金
          </div>
          <div class="left-desc">
            高风险，随股市涨跌
          </div>
        </div>
        <card-list class="right">
          <card-item
            v-for="(item, index) in espFunds"
            :key="index"
            :cardData="item"
            @look="detailPage"
          />
        </card-list>
      </section>
      <fund-list
        :typeObj="item"
        v-for="(item, id) in types"
        :key="id"
      />
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  get as getFundsList,
  getType as getFundTypes,
  rateChanges as changeRateRecords
} from '@/services/funds'
import { get as getFeature } from '@/services/feature'
import featureList from '@/components/feature-list'
import featureItem from '@/components/feature-item'
import cardList from '@/components/card-list'
import cardItem from '@/components/card-item'
import fundList from '@/components/fund-list'

export default {
  data() {
    return {
      types: [],
      espTypeId: '',
      funds: [],
      espFunds: [],
      espFundsCurrentPage: 1,
      features: [],
      scrollTop: 0
    }
  },
  async created() {
    await changeRateRecords()
    let res = await getFeature()
    if (res.resultcode === 0 ) {
      this.features = res.data.feature_list
    }
    res = await getFundTypes()
    if (res.resultcode === 0) {
      this.types = res.data.fundTypes
      if (this.types) {
        this.types.map((item, index) => {
          if (item.fundTypeName === '指数基金') {
            this.espTypeId = item.fundTypeId
            this.types.splice(index,1)
          }
        })
      }
    }
    this.getEspFunds(this.espTypeId)
  },
  methods: {
    async getEspFunds(typeId, pageNo = 1) {
      const res = await getFundsList({
        typeId,
        currentPage: pageNo,
        status: '已上市'
      })
      this.espFunds = res.data.listHelper
    },
    onScroll: function(e, position){
      this.scrollTop = position.scrollTop
    },
    detailPage(id) {
      this.$router.push({ name: 'fundInfo', params: {
        id
      }})
    },
    formatRate: function(row, column) {
      let rate = (row.rate * 100).toFixed(4)
      return rate + ' %'
    },
    formatPrice: function(row, column) {
      return (row.rate * 10000 / 365).toFixed(4)
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    imgClick() {
      alert('你点击了我')
    }
  },

  components: {
    featureList,
    featureItem,
    cardList,
    cardItem,
    fundList
  }
}
</script>

<style scoped lang="scss" scoped>
@import '~@/assets/scss/_vars.scss';
.banner-item {
  background-image: url("../../assets/image/banner1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
.image {
  overflow: hidden;
  img {
    display: block;
    height: 100%;
    width: 100%;
  }
}
.banner {
  width: 100%;
  height: 350px;
  display: block;
}


</style>

<style>
.el-carousel__container {
  position: relative;
  /*height: 350px;*/
}
</style>
