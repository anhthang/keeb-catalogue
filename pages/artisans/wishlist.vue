<template>
  <div class="container">
    <a-page-header title="Wishlist">
      <a-row :gutter="16" type="flex">
        <a-col :span="6">
          <wishlist-settings />
        </a-col>
        <a-col :span="18">
          <wishlist-preview />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>
