import { defineConfig } from 'umi';

export default defineConfig({
  base: '/product/',
  publicPath: '/product/',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
