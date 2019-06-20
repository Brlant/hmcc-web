<template>
  <div class="container mt-20">
    <warehouse-part class="w-part" ref="warehouse"></warehouse-part>
  </div>
</template>
<script>
  import WarehousePart from './warehouse/index';

  export default {
    components: {WarehousePart}
  };
</script>
