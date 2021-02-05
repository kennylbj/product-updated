import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/product-updated/',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
