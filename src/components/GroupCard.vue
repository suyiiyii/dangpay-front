<template>
  <ElCard class="enterprise-card">
    <!-- <template #header>
      <div class="card-header">
        <span>{{ data.name }}</span>
        <span v-if="data.amIAdmin" class="admin-badge">(Admin)</span>
      </div>
    </template> -->
    <div class="card-body">
      <el-descriptions :title="data.name" style="margin-top: 20px;min-width:400px" >
        <el-descriptions-item label="群组人数:">{{
          data.pepoleCount
        }}</el-descriptions-item>
        <el-descriptions-item label="企业规模">{{
          data.enterpriseScale
        }}</el-descriptions-item>
        <el-descriptions-item label="企业方向">
          {{ data.industry }}</el-descriptions-item
        >
        <!-- <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item> -->
        <el-descriptions-item label="地址">
          {{ data.address }}
        </el-descriptions-item>
        <el-descriptions-item label="联系方式">
          {{ data.contact }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <div class="info-row">
        <span>人数:</span>
        <span>{{ data.pepoleCount }}</span>
      </div>
      <div class="info-row">
        <span>企业规模:</span>
        <span>{{ data.enterpriseScale }}</span>
      </div>
      <div class="info-row">
        <span>企业方向:</span>
        <span>{{ data.industry }}</span>
      </div>
      <div class="info-row">
        <span>地址:</span>
        <span>{{ data.address }}</span>
      </div>
      <div class="info-row">
        <span>联系方式:</span>
        <span>{{ data.contact }}</span>
      </div> -->
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { ElCard } from "element-plus";
import { defineProps } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
/*
    {
        "id": 1,
        "name": "123",
        "pepoleCount": "3",
        "enterpriseScale": "123",
        "industry": "123",
        "address": "123",
        "contact": "123",
        "status": "normal",
        "hide": "false",
        "amIAdmin": true,
        "groupCreatorId": 5
    },
    */
</script>
