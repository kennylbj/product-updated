import { defineConfig } from 'umi';

export default defineConfig({
  base: '/product-updated/',
  publicPath: '/product-updated/',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  hash: true,
});
