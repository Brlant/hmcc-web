<style lang="scss" scoped="">
  .bg-box {
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border: 1px solid #eee;
    padding: 5px 15px;

    > div {
      padding: 10px;

      .bg-box-title {
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        padding-bottom: 10px;
      }
    }

    &.bg-box-warning {
      background: #fefdf7;
      color: #333
    }

    &.bg-box-white {
      background: #fff;
      color: #333
    }

    .bg-box-icon {
      font-size: 30px;
    }

    margin-bottom: 20px;
  }

  .bg-box-all {
    > div {
      width: 100%;
    }
  }
</style>


<template>
  <div :class="'bg-box bg-box-'+type">
    <div class="bg-box-icon" v-if="icon">
      <i :class="icon"></i>
    </div>
    <div>
      <div class="bg-box-title" v-if="title">{{ title }}
        <slot name="header-left"></slot>
        <slot name="header"></slot>
      </div>
      <div class="bg-box-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bgBox',

    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      }
    },

    data() {
      return {};
    },
    methods: {}
  };
</script>
