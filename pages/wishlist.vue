<template>
  <div class="wishlist" style="padding: 16px 0">
    <a-row :gutter="16">
      <a-col :span="6">
        <wishlist-settings />
      </a-col>
      <a-col :span="18">
        <wishlist-preview />
      </a-col>
    </a-row>
  </div>
</template>

<style>
.wishlist {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.wishlist .ant-card-cover {
  height: 250px;
  overflow: hidden;
}

.wishlist .ant-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
