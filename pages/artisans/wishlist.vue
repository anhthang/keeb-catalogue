<template>
  <div class="container">
    <a-page-header title="Wishlist">
      <a-row :gutter="16" type="flex">
        <a-col :xs="24" :md="8" :lg="6">
          <wishlist-settings />
        </a-col>
        <a-col :xs="24" :md="16" :lg="18">
          <wishlist-preview />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>
